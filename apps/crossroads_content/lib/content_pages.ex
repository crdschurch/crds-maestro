defmodule CrossroadsContent.Pages do
  @moduledoc """
    Handles getting all content from the CMS
  """
  use GenServer

  require Logger
  require IEx

  @timeout Application.get_env(:crossroads_content, :cms_timeout)

  @spec page_exists?(String.t) :: boolean
  def page_exists?(url) do
    GenServer.call(__MODULE__, {:exists, url}, @timeout)
  end

  @spec get_page(String.t) :: {:ok, map} | :error
  def get_page(url) do
    GenServer.call(__MODULE__, {:get, url}, @timeout)
  end

  @spec get_page_routes() :: [String.t]
  def get_page_routes() do
    GenServer.call(__MODULE__, {:routes}, @timeout)
  end

  @spec get_page_cache() :: map
  def get_page_cache() do
    GenServer.call(__MODULE__, {:cache}, @timeout)
  end

  def handle_call({:exists, url}, _from, cms_page_cache) do
    {:reply, Map.has_key?(cms_page_cache, url), cms_page_cache}
  end

  def handle_call({:get, url}, _from, cms_page_cache) do
    {:reply, Map.fetch(cms_page_cache, url), cms_page_cache}
  end

  def handle_call({:routes}, _from, cms_page_cache) do
    {:reply, Map.keys(cms_page_cache), cms_page_cache}
  end

  def handle_call({:cache}, _from, cms_page_cache) do
    {:reply, cms_page_cache, cms_page_cache}
  end

  @doc false
  def start_link(opts \\ []) do
    GenServer.start_link(__MODULE__, :ok, opts)
  end

  @doc false
  def init(:ok) do
    Process.send(self(), :refresh_cms_page_cache, [])
    {:ok, %{}}
  end

  def handle_info(:refresh_cms_page_cache, cms_page_cache) do
    schedule_refresh_cms_page_cache()
    cms_page_cache = load_cms_page_cache()
    {:noreply, cms_page_cache}
  end

  defp load_cms_page_cache() do
    Logger.debug("Loading all CMS pages")
    {:ok, 200, response} = CrossroadsContent.CmsClient.get_pages(false)
    cms_page_cache = create_page_cache_from_response(response)       
    Logger.debug("CMS page loading complete")
    cms_page_cache
  end

  defp create_page_cache_from_response(pages_response_body) do
    Enum.reduce(pages_response_body["pages"], %{}, fn(x, acc) -> 
      if(x["requiresAngular"] == "1") do 
        acc 
      else 
        Map.put(acc, x["link"], x)
      end 
    end )       
  end

  defp schedule_refresh_cms_page_cache() do
    Process.send_after(self(), :refresh_cms_page_cache, Application.get_env(:crossroads_content, :cms_cache_ttl))
  end
  
end
