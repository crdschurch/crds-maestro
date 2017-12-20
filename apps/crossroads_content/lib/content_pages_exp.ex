defmodule CrossroadsContent.PagesExp do
  @moduledoc """
  Handles getting all content from the CMS
  """
  use GenServer
  require Logger
  alias CrossroadsContent.CmsClient

  @timeout Application.get_env(:crossroads_content, :cms_timeout)
  @retry_interval [5, 60, 300]

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
  def get_page_routes do
    GenServer.call(__MODULE__, {:routes}, @timeout)
  end

  @spec get_page_cache() :: map
  def get_page_cache do
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
    page =
      case get_non_angular_page(url, true) do
        {:ok, _, %{"pages" => page_list}} when length(page_list) > 0 ->
          {:ok, List.first(page_list)}
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

  def handle_info(:refresh_cms_page_cache, _cms_page_cache) do
    schedule_refresh_cms_page_cache()
    cms_page_cache = load_cms_page_cache(@retry_interval)
    {:noreply, cms_page_cache}
  end

  def handle_info(:load_cms_page_cache, _cms_page_cache) do    
    cms_page_cache = load_cms_page_cache(@retry_interval)
    {:noreply, cms_page_cache}
  end

  def handle_info(:load_cms_page_cache, delay, _cms_page_cache) do
    # Process.send_after(self(), :load_cms_page_cache, delay)
    cms_page_cache = load_cms_page_cache(delay)
    {:noreply, %{}}
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

  defp set_redirector_pagetype(params) do
    Map.put(params, "pageType", "RedirectorPage")
  end

  defp get_non_angular_pages(stage) do
    params = Map.new |> set_angular_not_required |> set_stage(stage)
    CmsClient.get("Page", params)
  end

  defp get_non_angular_page(url, stage) do
    params =
      Map.new
      |> set_angular_not_required
      |> set_stage(stage)
      |> set_link(url)
    CmsClient.get("Page", params)
  end

  defp get_redirector_pages(stage) do
    params = Map.new |> set_redirector_pagetype |> set_stage(stage)
    redirector_pages = CmsClient.get("Page", params)

    case redirector_pages do
      {:ok, 200, response} ->
          id_map = get_redirector_targets(response)
          {:ok, 200, get_redirects(response, id_map)}
      {:error, _, %{error: response}} = resp ->
        Logger.error("Error getting CMS redirection targets: #{response}")
        resp
      err ->
        Logger.error("Error getting CMS redirection targets")
        err
    end
  end

  defp get_redirects(redirector_pages, id_map) do
    Enum.reduce(redirector_pages["pages"], %{}, fn(page, acc) ->
      url = if page["redirectionType"] == "Internal" do
        id_map[page["linkTo"]]["link"]
      else
        page["externalURL"]
      end

      if url != nil do
        Map.put(acc, page["link"], %{"id" => page["id"], "link" => page["link"], "redirectUrl" => url})
      else
        acc
      end
    end)
  end

  defp get_redirector_targets(redirector_pages) do
    # Call the CMS with up to 125 IDs at a time.
    # Ideally we would make a single CMS call,
    # but URLs are limited to 2K characters,
    # so batching in chunks of 125 will keep us from
    # exceeding the max URL length.
    redirector_pages
    |> get_target_page_ids
    |> split_ids_into_chunks(125)
    |> load_cms_pages_in_chunks
    |> build_redirect_map
  end

  defp get_target_page_ids(redirector_pages) do
    redirector_pages
      |> Map.get("pages", [])
      |> Enum.filter(fn page -> page["linkTo"] != nil end)
      |> Enum.map(fn page -> page["linkTo"] end)
      |> Enum.uniq
  end

  defp split_ids_into_chunks(id_list, chunk_size) do
    id_list
        |> Enum.chunk(chunk_size, chunk_size, [])
        |> Enum.map(fn x -> build_id_query x end)
  end

  defp build_id_query(id_chunk) do
    Enum.into(id_chunk, Keyword.new, fn x -> {"id[]", x} end)
  end

  defp load_cms_pages_in_chunks(id_chunks) do
    id_chunks
    |> Enum.map(fn query -> CmsClient.get("Page", query) end)
    |> Enum.reduce([], fn(x, acc) ->
        case x do
          {:ok, 200, response} -> [response["pages"] | acc] |> List.flatten
          {:error, _, %{error: response}} ->
            Logger.error "Error getting redirection pages: #{response}"
            acc
          _ ->
            Logger.error "Error getting redirection pages"
            acc
        end
      end)
  end

  # return a map keyed by page ID
  defp build_redirect_map(page_list) do
    page_list
    |> Enum.reduce(%{}, fn(page, acc) ->
      redirect_data = %{
        "title" => page["title"],
        "link" => page["link"],
      }
      Map.put(acc, page["id"], redirect_data)
    end)
  end

  defp load_cms_page_cache(retry_times) do
    Logger.debug("Loading all CMS pages")

    # get map of all RedirectorPages
    # regardless of whether "Requires Angular" is set
    redirector_pages = case get_redirector_pages(false) do
      {:ok, 200, response} -> response
      {:error, _, %{error: response}} ->
        Logger.error("Error getting CMS RedirectorPage pages: #{response}")        
        %{}
      _ ->
        Logger.error("Error getting CMS RedirectorPage pages")
        %{}
    end

    # get map of pages that do not require Angular
    non_angular_pages = case get_non_angular_pages(false) do
      {:ok, 200, response} ->
        create_page_map_from_response(response)
      {:error, _, %{error: response}} ->
        Logger.error("Error getting CMS pages: #{response}")
        retry_cms_refresh(retry_times)        
      _ ->
        Logger.error("Error getting CMS pages")
        %{}
    end

    # combine (redirector_pages take precedence if there are duplicate keys)
    cms_page_cache = Map.merge(non_angular_pages, redirector_pages)
    Logger.debug("CMS page loading complete")
    cms_page_cache
  end

  defp create_page_map_from_response(pages_response_body) do
    # Convert the list of \"pages\" to a map keyed by the page \"link\"
    Enum.reduce(pages_response_body["pages"], %{}, fn(x, acc) ->
      Map.put(acc, x["link"], x) end)
  end

  defp retry_cms_refresh([time|times]) do
    Logger.debug("Retry loading all CMS pages in #{time} seconds")
    Process.send_after(self(), :load_cms_page_cache, time * 1000)
  end

  defp retry_cms_refresh([]), do: %{}

  defp schedule_refresh_cms_page_cache do
    Process.send_after(self(),
                       :refresh_cms_page_cache,
                       Application.get_env(:crossroads_content, :cms_cache_ttl))
  end
end
