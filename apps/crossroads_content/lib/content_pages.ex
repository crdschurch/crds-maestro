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
    {:reply, Map.has_key?(cms_page_cache, url), cms_page_cache}
  end

  def get_page(url) do
    GenServer.call(__MODULE__, {:get, url}, @timeout)
  end

  def handle_call({:get, url}, _from, cms_page_cache) do
    {:reply, Map.fetch(cms_page_cache, url), cms_page_cache}
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
    response = CrossroadsContent.CmsClient.get_pages(false)
    cms_page_cache = case response do
      {:ok, 200, body} ->
        Enum.into(body["pages"], %{}, fn(x) -> {x["link"], x} end)
      {:error, _status, _body} -> %{}
    end
    # ** Remove after golocal is properly de-angulared **
    cms_page_cache = Map.delete(cms_page_cache, "/golocal/")
    cms_page_cache
  end

  defp schedule_refresh_cms_page_cache() do
    Process.send_after(self(), :refresh_cms_page_cache, Application.get_env(:crossroads_content, :cms_cache_ttl))
  end
  
end
