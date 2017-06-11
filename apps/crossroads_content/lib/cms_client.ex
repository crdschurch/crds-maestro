defmodule CrossroadsContent.CmsClient do
  @moduledoc """
    Handles getting all content from the CMS
  """
  use GenServer

  require Logger
  require IEx

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

  @spec get_system_page(String.t) :: {:ok | :error, number, map}
  def get_system_page(state_name) do
    GenServer.call(__MODULE__, {:system_page, state_name}, @timeout)
  end

  @spec get_pages(boolean) :: {:ok | :error, number, map}
  def get_pages(stage) do
    GenServer.call(__MODULE__, {:pages, stage}, @timeout)
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
  def handle_call({:site_config, id}, _from, state) do
    path = "SiteConfig/#{id}"
    make_cached_call(path, state)
  end

  @doc false
  def handle_call({:content_blocks}, _from, state) do
    path = "ContentBlock"
    make_cached_call(path, state)
  end

  @doc false
  def handle_call({:system_page, state_name}, _from, state) do
    path = "SystemPage/?StateName=#{state_name}"
    make_cached_call(path, state)
  end

  @doc false
  def handle_call({:page, url, true}, _from, state) do
    path = "Page/?link=#{url}&stage=Stage"
    make_call(path, state)
  end

  @doc false
  def handle_call({:page, url, false}, _from, state) do
    path = "Page/?link=#{url}"
    make_cached_call(path, state)
  end

  @doc false
  def handle_call({:pages, false}, _from, state) do
    path = "Page"
    make_cached_call(path, state)
  end

  @doc false
  def handle_call({:pages, true}, _from, state) do
    path = "Page/?stage=Stage"
    make_cached_call(path, state)
  end

  @doc false
  def handle_call({:all, url, params}, _from, state) do
    path = "#{url}?#{URI.encode_query(params)}"
    make_call(path, state)
  end

  @doc false
  defp make_cached_call(path, state) do
    {status, result} = Cachex.get(:cms_cache, path)
    if status == :missing do
      {:reply, result, state} = make_call(path,state)
      if elem(result, 0) == :ok do
        Cachex.set(:cms_cache, path, result)
      end      
    end
    {:reply, result, state}
  end

  defp make_call(path, state) do
    result = match_response(HTTPoison.get("#{@base_url}/api/#{path}",["Accept": "application/json"], [recv_timeout: @timeout]))
    {:reply, result, state}
  end

  defp match_response({:ok, %HTTPoison.Response{status_code: 404, body: body}}) do
    {:error, 404, decode_request(Poison.decode(body))}
  end

  defp match_response({:ok, %HTTPoison.Response{status_code: 200, body: body, headers: headers}}) do
    if determine_headers(headers) do
      {:error, 400, %{}}
    else 
      {:ok, 200, decode_request(Poison.decode(body))}
    end
  end

  defp match_response({:error, %HTTPoison.Error{reason: reason}}) do
    {:error, 500, %{error: reason}}
  end

  defp match_response(_), do: {:error, 0, %{error: "unknown response"}} 

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
