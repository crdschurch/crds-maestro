defmodule CrossroadsInterface.ErrorView do
  use CrossroadsInterface.Web, :view
  require IEx
  # alias CrossroadsContent.Pages

  def render("404.html", assigns) do
    # conn = assigns[:conn]
    #params = conn.query_stringL #headers = conn.req_headers
    #case Pages.get_page(conn.request_path <> "/", false) do
      #{:ok, 200, %{ "pages" => [first | rest]}} ->
        #if Map.has_key?(first, "content") do
          #payload = Map.get(first, "content")
          #page_type = Map.get(first, "pageType", "CenteredContentPage")
          #render("content_page.html", %{payload: payload, page_type: page_type, content_blocks: ContentHelpers.content_blocks(), conn: conn})
        #else
          ## TODO render the CMS 404 page, not the Server Error Page
          #render("500.html", assigns)
        #end
      #{_, _, body} -> render("500.html", assigns)
    #end
    # Fall through to the legacy crds-angular appliction and let
    # it handle the route.
    #conn = assigns[:conn]
    #payload = case Pages.get_page("/servererror/", false) do
      #{:ok, 200, body} -> Enum.at(body["pages"], 0)["content"]
      #{_, _, body} -> "<h2> #{body} </h2>"
    #end
    render("404.html", assigns)
  end

  def render("500.html", assigns) do
    #conn = assigns[:conn]
    #payload = case Pages.get_page("/servererror/", false) do
      #{:ok, 200, body} -> Enum.at(body["pages"], 0)["content"]
      #{_, _, body} -> "<h2> #{body} </h2>"
    #end
    #render("server_error.html", %{payload: payload, conn: conn})
    render("index.html", assigns)
  end

  # In case no render clause matches or no
  # template is found, let's render it as 500
  def template_not_found(_template, assigns) do
    render "500.html", assigns
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

end
