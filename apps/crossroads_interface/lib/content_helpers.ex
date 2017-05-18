defmodule ContentHelpers do

  alias CrossroadsContent.CmsClient

  @spec content_blocks :: [map]
  def content_blocks do
    case CmsClient.get_content_blocks do
      {:ok, 200, body} -> Map.get(body, "contentBlocks", [])
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

  def addTrailingSlashIfNecessary(url) do
    case String.last(url) do
      "/" -> url
      _ -> url <> "/"
    end
  end

end
