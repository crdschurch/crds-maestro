defmodule CrossroadsInterface.LegacyController do
  use CrossroadsInterface.Web, :controller
  require IEx
  @moduledoc"""
  This controller is called from the fall through route in the router.
  The purpose is to handle serving up the 'legacy' angular application using
  the legacy template
  """

  plug CrossroadsInterface.Plug.PutMetaTemplate, "angular_meta_tags.html"
  plug :put_layout, "no_header_or_footer.html"

  defp renderSite(conn, params) do
    path = ContentHelpers.add_trailing_slash_if_necessary(conn.request_path)
    case CrossroadsContent.Pages.get_page(path, ContentHelpers.is_stage_request?(conn.params)) do
      {:ok, page} -> conn |> assign(:page, page) |> CrossroadsInterface.CmsPageController.call(:index)
      _ -> conn |> renderLegacyApp(params)
    end
  end

  defp renderLegacyApp(conn, params) do
    conn |> render("app_root.html", %{ "js_files": [
        "/js/legacy/ang.js",
        "/js/legacy/core.js",
        "/js/legacy/common.js",
        "/js/legacy/profile.js",
        "/js/legacy/trips.js",
        "/js/legacy/camps.js",
        "/js/legacy/give.js",
        "/js/legacy/media.js",
        "/js/legacy/search.js",
        "/js/legacy/load-image.all.min.js",
        "/js/legacy/govolunteer.js",
        "/js/legacy/formbuilder.js",
        "/js/legacy/childcare.js",
        "/js/legacy/formlybuilder.js",
        "/js/legacy/main.js"
      ], "css_files": [
       "/js/legacy/legacy.css"
      ], "base_href": "/"})
  end

  @doc """
  When angular can't find a route, it sends a request back with ?resolve=true
  which in turn renders error view and the 404 template
  """
  def index(conn, %{ "resolve" => "true" }) do
    conn
    |> CrossroadsInterface.Plug.ContentBlocks.call("")
    |> CrossroadsInterface.Plug.Meta.call("")
    |> CrossroadsInterface.Plug.PutMetaTemplate.call("meta_tags.html")
    |> put_layout("no_sidebar.html")
    |> put_status(404)
    |> render(CrossroadsInterface.ErrorView, "404.html",
        %{"css_files": [ "/js/legacy/legacy.css" ]})
  end

  def index(conn, _params) do
    conn
    |> CrossroadsInterface.Plug.RedirectCookie.call("/")
    |> renderSite( conn: conn, params: _params)
  end

  def noRedirect(conn, _params) do
    conn |> renderSite( conn: conn, params: _params)
  end
end
