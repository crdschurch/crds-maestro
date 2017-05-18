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
    path = ContentHelpers.addTrailingSlashIfNecessary(conn.request_path)
    if CrossroadsContent.Pages.page_exists?(path) do
      conn |> assign(:path, path) |> CrossroadsInterface.CmsPageController.call(:index)
    else  
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
  end

  def index(conn, %{ "resolve" => "true" }) do
    conn
    |> redirect( to: "/notfound")
  end

  def index(conn, _params) do    
    conn
      |> CrossroadsInterface.Plug.RedirectCookie.call("/")
      |> renderSite( conn: conn, params: _params)
  end

  def noRedirect(conn, _params) do
    conn
      |> renderSite( conn: conn, params: _params)
  end

end
