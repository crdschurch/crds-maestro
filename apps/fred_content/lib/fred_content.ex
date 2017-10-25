defmodule FredContent do
  @moduledoc """
  Pulls html content from FRED for use on Crossroads.net
  """
  use GenServer
  require Logger

  @name __MODULE__
  @server Application.get_env(:fred_content, :fred_server_endpoint, "")
  @fredclass "fred-form"

  @doc false
  def start_link(opts \\ []) do
    opts = Keyword.put_new(opts, :name, @name)
    GenServer.start_link(__MODULE__, :ok, opts)
  end

  @doc false
  def init(:ok) do
    {:ok, %{}}
  end

  @doc """
  Get the form based on the name and prepopulate based on the contact id
  """
  @spec fetch_form(String.t, integer()) :: String.t
  def fetch_form(form_name, contact_id) do
    GenServer.call(@name, {:fetch_form, form_name, contact_id}, 5000)
  end

  @doc """
  Takes a unique url and an html string, finds the element with a class of `fred-form` and gets the id attribute.

  The unique url is used for caching so we don't have to parse the data so many times.

  We assume that the user wants to replace the first instance of `<div id="blah" class="fred-form"> </div>` with the actual content of the blah form.

  ## Examples

    iex> FredContent.get_form_name(:unique_url, "<div id='blah' class='fred-form'></div>")
    "blah"
  """
  @spec get_form_name(atom(), String.t) :: String.t
  def get_form_name(key, payload) do
    GenServer.call(@name, {:get_form_name, key, payload}, 5000)
  end


  @spec inject_form(nil | String.t, String.t) :: String.t
  def inject_form(nil, payload), do: payload
  def inject_form(form, payload) do
    payload
    |> Floki.parse
    |> transform(form)
    |> Floki.raw_html
  end

  @doc false
  def handle_call({:get_form_name, key, payload}, _from, state) do
    case form_name_from_cache(state, key) do
      nil ->
        {:reply,
         payload
         |> Floki.find(".#{@fredclass}")
         |> Floki.attribute("id")
         |> List.first,
          state}
      form_name -> {:reply, form_name, state}
  end

  @doc false
  def handle_call({:fetch_form, form_name, contact_id}, _from, state) do
    "#{@server}/#{form_name}?partial=true"
    |> HTTPoison.get(%{}, hackney: [cookie: ["userId=#{contact_id}"]])
    |> case do
      {:ok, %HTTPoison.Response{body: body}} ->
        {:reply, body, state}
      {:error, _error} ->
        {:reply, "", state}
    end
  end

  defp form_name_from_cache(state, form_name) do
    state
    |> Map.get
  end

  defp transform(el, to_inject) when is_list(el) do
    Enum.map(el, &transform(&1, to_inject))
  end
  defp transform({el, attrs, rest}, to_inject) do
    cond do
      is_fred_div?(attrs) -> Floki.parse(to_inject)
      Enum.empty?(rest) -> {el, attrs, rest}
      true -> {el, attrs, transform(rest, to_inject)}
    end
  end
  defp transform({el, attrs}, _to_inject), do: {el, attrs}
  defp transform(text, _to_inject), do: text

  defp is_fred_div?(attrs) do
    res =
      attrs
      |> Enum.filter(fn({attr_name, attr_val}) ->
        attr_name == "class" && attr_val == @fredclass
      end)
      |> Enum.empty?
    !res
  end

end
