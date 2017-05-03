defmodule CrossroadsContent.Pages do
  @moduledoc """
    Handles getting all content from the CMS
  """
  use GenServer

  require Logger

  @base_url Application.get_env(:crossroads_content, :cms_server_endpoint)
  @timeout Application.get_env(:crossroads_content, :cms_timeout)

  @spec get_site_config(number) :: {:ok | :error, number, map}
  def get_site_config(id) do
    GenServer.call(__MODULE__, {:site_config, id}, @timeout)
  end

  @spec get_content_blocks :: {:ok | :error, number, map}
  def get_content_blocks do
    GenServer.call(__MODULE__, {:content_blocks}, @timeout)
  end

  @spec get_series_all :: {:ok | :error, number, map}
  def get_series_all do
    GenServer.call(__MODULE__, {:series_all}, @timeout)
  end  

  @spec get_system_page(String.t) :: {:ok | :error, number, map}
  def get_system_page(state_name) do
    GenServer.call(__MODULE__, {:system_page, state_name}, @timeout)
  end

  @spec get_page(String.t, boolean) :: {:ok | :error, number, map}
  def get_page(url, stage) do
    GenServer.call(__MODULE__, {:page, url, stage}, @timeout)
  end

  @spec get(String.t, map) :: {:ok | :error, number, map}
  def get(url, params) do
    GenServer.call(__MODULE__, {:all, url, params}, @timeout)
  end

  @doc false
  def start_link(opts \\ []) do
    GenServer.start_link(__MODULE__, :ok, opts)
  end

  @doc false
  def init(:ok) do
    {:ok, %{}}
  end

  @doc false
  def handle_call({:site_config, id},_from, state) do
    path = "SiteConfig/#{id}"
    make_call(path, state)
  end

  @doc false
  def handle_call({:content_blocks}, _from, state) do
    path = "ContentBlock"
    make_call(path, state)
  end

  @doc false
  def handle_call({:system_page, state_name}, _from, state) do
    path = "SystemPage/?StateName=#{state_name}"
    make_call(path, state)
  end

  @doc false
  def handle_call({:page, url, true}, _from, state) do
    path = "Page/?link=#{url}&stage=Stage"
    make_call(path, state)
  end

  @doc false
  def handle_call({:all, url, params}, _from, state) do
    path = "#{url}?#{URI.encode_query(params)}"
    make_call(path, state)
  end

  @doc false
  def handle_call({:page, url, false}, _from, state) do
    path = "Page/?link=#{url}"
    make_call(path, state)
  end

  @doc false
  def handle_call({:series_all}, _from, state) do
    todaysDateString = Date.to_iso8601(Date.utc_today)
    path = "series?endDate__GreaterThanOrEqual=" <> todaysDateString <> "&endDate__sort=ASC"        
    make_call(path, state)
  end  

  #TODO: make this match more dynamic and timeout
  #defp make_call(path, %{"series?" => path_val} = state) do
    #{:reply, path_val, state}
  #end

  @doc false
  defp make_call(path, state) do
    {status, response} = Cachex.get(:cms_cache, path)
    if status == :missing do
      response = case HTTPoison.get("#{@base_url}/api/#{path}",["Accept": "application/json"], [recv_timeout: @timeout]) do
        {:ok, %HTTPoison.Response{status_code: 404, body: body}} ->
          {:error, 404, decode_request(Poison.decode(body))}
        {:ok, %HTTPoison.Response{status_code: 200, body: body, headers: headers}} ->
          if determine_headers(headers) do
            {:error, 400, %{}}
          else 
            {:ok, 200, decode_request(Poison.decode(body))}
          end
        {:error, %HTTPoison.Error{reason: reason}} ->
          {:error, 500, %{error: reason}}
        {_, _} ->
          {:error, 0, %{error: "unknown response"}}
      end
      if elem(response, 0) == :ok do
        Cachex.set(:cms_cache, path, response)
      end      
    end
    state = Map.put(state, path, response)
    {:reply, response, state}
  end

  defp determine_headers(headers) do
    case Enum.filter(headers, &is_html/1) do
      [] -> false
      _  -> true
    end

  end

  defp is_html({"Content-Type", type}) do
    type == "text/html"
  end
  defp is_html(header), do: false
  
  defp decode_request({:ok, valid} = body), do: valid
  defp decode_request({:error, _} = body), do: %{}

end
