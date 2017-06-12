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
    GenServer.call(__MODULE__, {:exists, url, false}, @timeout)
  end

  @spec page_exists?(String.t, boolean) :: boolean
  def page_exists?(url, stage) do
    GenServer.call(__MODULE__, {:exists, url, stage}, @timeout)
  end

  @spec get_page(String.t) :: {:ok, map} | :error
  def get_page(url) do
    GenServer.call(__MODULE__, {:get, url, false}, @timeout)
  end

  @spec get_page(String.t, boolean) :: {:ok, map} | :error  
  def get_page(url, stage) do
    GenServer.call(__MODULE__, {:get, url, stage}, @timeout)
  end

  @spec get_page_routes() :: [String.t]
  def get_page_routes() do
    GenServer.call(__MODULE__, {:routes}, @timeout)
  end

  @spec get_page_cache() :: map
  def get_page_cache() do
    GenServer.call(__MODULE__, {:cache}, @timeout)
  end

  def handle_call({:exists, url, false}, _from, cms_page_cache) do
    {:reply, Map.has_key?(cms_page_cache, url), cms_page_cache}
  end

  def handle_call({:exists, url, true}, _from, cms_page_cache) do
    exists = case get_non_angular_page(url, true) do
      {:ok, _, body} -> List.first(body["pages"]) != nil
      _ -> false
    end
    {:reply, exists, cms_page_cache}
  end

  def handle_call({:get, url, false}, _from, cms_page_cache) do
    {:reply, Map.fetch(cms_page_cache, url), cms_page_cache}
  end

  def handle_call({:get, url, true}, _from, cms_page_cache) do
    page = case get_non_angular_page(url, true) do
      {:ok, _, %{"pages" => page_list}} when length(page_list) > 0 -> {:ok, List.first(page_list)}
      _ -> :error
    end      
    {:reply, page, cms_page_cache}
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

  defp set_angular_not_required(params) do
    Map.put(params, "requiresAngular", 0)
  end

  defp set_stage(params, stage) do
    case stage do
      true -> Map.put(params, "stage", "Stage")
      false -> params
    end
  end

  defp set_link(params, url) do
    Map.put(params, "link", url)
  end

  defp get_non_angular_pages(stage) do
    CrossroadsContent.CmsClient.get("Page", Map.new |> set_angular_not_required |> set_stage(stage))
  end

  defp get_non_angular_page(url, stage) do  
    CrossroadsContent.CmsClient.get("Page", Map.new |> set_angular_not_required |> set_stage(stage) |> set_link(url))
  end

  defp load_cms_page_cache() do
    Logger.debug("Loading all CMS pages")    
    cms_page_cache = case get_non_angular_pages(false) do
      {:ok, 200, response} -> create_page_cache_from_response(response)
      {:error, _, %{error: response}} -> Logger.error("Error getting CMS pages: #{response}"); %{}
      _ -> Logger.error("Error getting CMS pages"); %{}
    end    
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
