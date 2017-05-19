defmodule CrossroadsContent.Pages do
  @moduledoc """
    Handles getting all content from the CMS
  """
  use GenServer

  require Logger
  require IEx

  @timeout Application.get_env(:crossroads_content, :cms_timeout)

  def page_exists?(url) do
    GenServer.call(__MODULE__, {:exists, url}, @timeout)
  end

  def handle_call({:exists, url}, _from, cms_page_cache) do
    IEx.pry
    {:reply, Map.has_key?(cms_page_cache, url), cms_page_cache}
  end

  def get_page(url) do
    GenServer.call(__MODULE__, {:get, url}, @timeout)
  end

  def handle_call({:get, url}, _from, cms_page_cache) do
    {:reply, Map.fetch(cms_page_cache, url), cms_page_cache}
  end

  def get_page_routes() do
    GenServer.call(__MODULE__, {:routes}, @timeout)
  end

  def handle_call({:routes}, _from, cms_page_cache) do
    {:reply, Map.keys(cms_page_cache), cms_page_cache}
  end

  def get_page_cache() do
    GenServer.call(__MODULE__, {:cache}, @timeout)
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
    IO.puts "Loading all CMS pages"
    response = CrossroadsContent.CmsClient.get_pages(false)
    cms_page_cache = case response do
      {:ok, 200, body} ->
        Enum.reduce(body["pages"], %{}, fn(x, acc) -> 
          if(x["requiresAngular"] == "1") do 
            acc 
          else 
            Map.put(acc, x["link"], x)
          end 
        end )       
      {:error, _status, _body} -> %{}        
    end
    IO.puts "Loading all CMS pages complete"
    cms_page_cache
  end

  defp schedule_refresh_cms_page_cache() do
    Process.send_after(self(), :refresh_cms_page_cache, Application.get_env(:crossroads_content, :cms_cache_ttl))
  end
  
end
