defmodule CrossroadsContent.Pages do
  @moduledoc """
    Handles getting all content from the CMS
  """
  use GenServer

  require Logger
  require IEx

  @doc false
  def start_link(opts \\ []) do
    GenServer.start_link(__MODULE__, :ok, opts)
  end

  @doc false
  def init(state) do
    Cachex.start_link(:cms_page_cache, [default_ttl: Application.get_env(:crossroads_content, :cms_cache_ttl)])
    Process.send(self(), :refresh_cms_page_cache, [])
    {:ok, %{}}
  end

  def handle_info(:refresh_cms_page_cache, state) do
    schedule_refresh_cms_page_cache()
    load_cms_page_cache(state)
    {:noreply, state}
  end

  defp load_cms_page_cache(state) do
    {reply, response, state} = CrossroadsContent.CmsClient.get_pages(false)
    status = case response do
      {:ok, 200, body} ->
        Enum.each(body["pages"], 
          fn(x) -> 
            Cachex.set(:cms_cache, x["link"], x) 
          end 
        ) 
      {:error, _status, _body} -> nil
    end
    status
  end

  defp schedule_refresh_cms_page_cache() do
    Process.send_after(self(), :refresh_cms_page_cache, 60 * 1000)
  end
  
end
