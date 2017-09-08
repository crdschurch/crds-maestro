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

  defp set_redirector_pagetype(params) do
    Map.put(params, "pageType", "RedirectorPage")
  end

  defp get_non_angular_pages(stage) do
    CrossroadsContent.CmsClient.get("Page", Map.new |> set_angular_not_required |> set_stage(stage))
  end

  defp get_non_angular_page(url, stage) do
    CrossroadsContent.CmsClient.get("Page", Map.new |> set_angular_not_required |> set_stage(stage) |> set_link(url))
  end

  defp get_redirector_pages(stage) do
    redirector_pages = CrossroadsContent.CmsClient.get("Page", Map.new |> set_redirector_pagetype |> set_stage(stage))

    case redirector_pages do
      {:ok, 200, response} ->
          id_map = get_redirector_targets(response)
          {:ok, 200, get_redirects(response, id_map)}
      {:error, _, %{error: response}} -> Logger.error("Error getting CMS redirection targets: #{response}"); %{}
      _ -> Logger.error("Error getting CMS redirection targets"); %{}
    end
  end

  defp get_redirects(redirector_pages, id_map) do
    Enum.reduce(redirector_pages["pages"], %{}, fn(page, acc) ->
      url = cond do
        page["redirectionType"] == "Internal" -> id_map[page["linkTo"]]["link"]
        true -> page["externalURL"]
      end

      cond do
        url != nil -> Map.put(acc, page["link"], %{ "id" => page["id"], "link" => page["link"], "redirectUrl" => url })
        true -> acc
      end
    end )
  end

  defp get_redirector_targets(redirector_pages) do
    get_link_to = fn page ->
      case page["linkTo"] do
        0 -> false
        _ -> page["linkTo"]
      end
    end

    # Each redirector_page will have a "linkTo" element that contains the ID of the target
    # page. We need to retrieve each target page (by ID) in order to get the target URL.
    ids = case Map.fetch(redirector_pages, "pages") do
      {:ok, value} -> value |> Enum.filter(get_link_to) |> Enum.map(get_link_to) |> Enum.uniq
      _ -> %{}
    end

    # Call the CMS with up to 150 IDs at a time. Ideally we would make a single CMS call,
    # but URLs are limited to 2K characters, so batching in chunks of 150 will keep us from
    # exceeding the max URL length.
    id_chunks = get_id_chunks(ids)
    id_queries = Enum.map(id_chunks, fn x -> build_id_query x end)

    target_pages = Enum.map(id_queries, fn query -> CrossroadsContent.CmsClient.get("Page", query) end)
      |> Enum.reduce([], fn(x, acc) ->
        case x do
          {:ok, 200, response} -> [response["pages"] | acc] |> List.flatten
          {:error, _, %{error: response}} -> Logger.error "Error getting redirection pages: #{response}"; acc
          _ -> Logger.error "Error getting redirection pages"; acc
        end
      end)

    Enum.reduce(target_pages, %{}, fn(page, acc) ->
      redirectData = %{
        "title" => page["title"],
        "link" => page["link"],
      }
      Map.put(acc, page["id"], redirectData)
    end )
  end

  defp get_id_chunks(ids) when length(ids) === 0 do [] end
  defp get_id_chunks(ids) do
    max_ids_per_call = 150;

    {head, tail} = Enum.split(ids, max_ids_per_call)

    [head | get_id_chunks(tail)]
  end

  defp build_id_query(id_chunk) do
    Enum.into(id_chunk, Keyword.new, fn x -> {"id[]", x} end)
  end

  defp load_cms_page_cache() do
    Logger.debug("Loading all CMS pages")

    # get map of all RedirectorPages (regardless of whether "Requires Angular" is set)
    redirector_pages = case get_redirector_pages(false) do
      {:ok, 200, response} -> response
      {:error, _, %{error: response}} -> Logger.error("Error getting CMS RedirectorPage pages: #{response}"); %{}
      _ -> Logger.error("Error getting CMS RedirectorPage pages"); %{}
    end

    # get map of pages that do not require Angular
    non_angular_pages = case get_non_angular_pages(false) do
      {:ok, 200, response} -> create_page_map_from_response(response)
      {:error, _, %{error: response}} -> Logger.error("Error getting CMS pages: #{response}"); %{}
      _ -> Logger.error("Error getting CMS pages"); %{}
    end

    # combine (redirector_pages take precedence if there are duplicate keys)
    cms_page_cache = Map.merge(non_angular_pages, redirector_pages)

    Logger.debug("CMS page loading complete")

    cms_page_cache
  end

  @doc "Convert the list of \"pages\" to a map keyed by the page \"link\""
  defp create_page_map_from_response(pages_response_body) do
    Enum.reduce(pages_response_body["pages"], %{}, fn(x, acc) -> Map.put(acc, x["link"], x) end)
  end

  defp schedule_refresh_cms_page_cache() do
    Process.send_after(self(), :refresh_cms_page_cache, Application.get_env(:crossroads_content, :cms_cache_ttl))
  end
end
