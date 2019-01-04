defmodule ContentHelpers do
  @moduledoc """
  Helpers for CMS Content pages
  """

  alias CrossroadsContent.CmsClient

  @spec content_blocks :: [map]
  def content_blocks do
    case CmsClient.get_content_blocks do
      {:ok, 200, body} -> Map.get(body, "contentblocks", [])
      {_, _, _} -> []
    end
  end

  @spec determine_page_type(String.t) :: String.t
  def determine_page_type(page_type) do
    new_type = Macro.underscore(page_type) <> ".html"
    # why does noSidebar return Page as it's type?
    case new_type do
      "page.html" -> "no_sidebar.html"
      _ -> new_type
    end
  end

  def add_trailing_slash_if_necessary(url) do
    case String.last(url) do
      "/" -> url
      _ -> url <> "/"
    end
  end

  def is_stage_request?(params) do
    case params do
      %{"stage" => "Stage"} -> true
      _ -> false
    end
  end
end
