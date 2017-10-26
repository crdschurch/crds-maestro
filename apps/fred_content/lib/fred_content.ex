defmodule FredContent do
  @moduledoc """
  Pulls html content from FRED for use on Crossroads.net
  """
  require Logger

  @server Application.get_env(:fred_content, :fred_server_endpoint)
  @fredclass "fred-form"
  @cache :fred_cache
  @cache_http_ttl Application.get_env(:fred_content, :http_cache_ttl)
  @cache_formname_ttl Application.get_env(:fred_content, :formname_cache_ttl)

  @doc """
  Get the form based on the name and prepopulate based on the contact id
  """
  @spec fetch_form(String.t, integer()) :: String.t
  def fetch_form(form_name, contact_id, redirect \\ "") do
    key_name = form_name <> "#{contact_id}"
    @cache
    |> Cachex.get(key_name)
    |> case do
      {:ok, value} ->
        value
      _ ->
        form_name
        |> build_url(redirect)
        |> HTTPoison.get(%{}, hackney: [cookie: ["userId=#{contact_id}"]])
        |> case do
          {:ok, %HTTPoison.Response{body: body}} ->
            Cachex.set(@cache, key_name, body, async: true, ttl: @cache_http_ttl)
            body
          {:error, _error} ->
            Cachex.set(@cache, key_name <> "#{contact_id}", "", async: true, ttl: @cache_http_ttl)
            ""
        end
    end
  end

  @doc """
  Takes a unique url and an html string, finds the element with a class of `fred-form` and gets the id attribute and optional redirecturl attribute values.

  The unique url is used for caching so we don't have to parse the data so many times.

  We assume that the user wants to replace the first instance of `<div id="blah" class="fred-form"> </div>` with the actual content of the blah form.

  ## Examples

    iex> FredContent.get_form_info(:unique_url, "<div id='blah' class='fred-form'></div>")
    %{form_id: "blah", redirect_url: nil}

    iex> FredContent.get_form_info(:another_unique_url, "<div id='blah' class='fred-form' redirecturl='/url'></div>")
    %{form_id: "blah", redirect_url: "/url"}
  """
  @spec get_form_info(atom(), String.t) :: %{form_name: String.t, redirect_url: String.t}
  def get_form_info(key, payload) do
    exists = @cache |> Cachex.get(key)
    case exists do
      {:ok, value} -> value
      _ ->
        cache =
          payload
          |> Floki.find(".#{@fredclass}")
          |> List.first
          |> fred_attribute_values
        Cachex.set(@cache, key, cache, async: true, ttl: @cache_formname_ttl)
        cache
    end
  end

  @spec inject_form(nil | String.t, String.t) :: String.t
  def inject_form(nil, payload), do: payload
  def inject_form(form, payload) do
    payload
    |> Floki.parse
    |> transform(form)
    |> Floki.raw_html
  end

  defp build_url(form_name, nil), do: "#{@server}/#{form_name}?partial=true"
  defp build_url(form_name, ""), do: "#{@server}/#{form_name}?partial=true"
  defp build_url(form_name, redirect_url), do: "#{@server}/#{form_name}?partial=true&redirecturl=#{redirect_url}"

  defp fred_attribute_values(nil), do: nil
  defp fred_attribute_values(el) do
    id = Floki.attribute(el, "id")
         |> case do
           nil -> ""
           [] -> ""
           [el] -> el
           [el | rest] -> el
           anything -> anything
         end
    url = Floki.attribute(el, "redirecturl")
          |> case do
            nil -> ""
            list -> List.first(list)
          end
    %{form_id: id, redirect_url: url}
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
