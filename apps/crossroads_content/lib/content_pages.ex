defmodule CrossroadsContent.Pages do
  @moduledoc """
    Handles getting all content from the CMS
  """
  use GenServer

  require Logger
  require IEx

  def page_exists?(url) do
    GenServer.call(__MODULE__, {:exists, url})
  end

  def handle_call({:exists, url}, _from, cms_page_cache) do
    {:reply, Map.has_key?(cms_page_cache, url), cms_page_cache}
  end

  def get_page(url) do
    GenServer.call(__MODULE__, {:get, url})
  end

  def handle_call({:get, url}, _from, cms_page_cache) do
    {:reply, Map.fetch(cms_page_cache, url), cms_page_cache}
  end

  @doc false
  def start_link(opts \\ []) do
    IO.puts "CrossroadsContent.Pages start"
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
    response = CrossroadsContent.CmsClient.get_pages(false)
    IEx.pry
    cms_page_cache = case response do
      {:ok, 200, body} ->
        Enum.group_by(body["pages"], fn(x) -> x["link"] end, fn(x) -> x end)
      {:error, _status, _body} -> %{}
    end
    cms_page_cache
  end

  defp schedule_refresh_cms_page_cache() do
    Process.send_after(self(), :refresh_cms_page_cache, Application.get_env(:crossroads_content, :cms_cache_ttl))
  end
  
end
