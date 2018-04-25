defmodule CrossroadsInterface.LegacyController do
  require Logger
  use CrossroadsInterface.Web, :controller
  alias CrossroadsInterface.NotfoundController

  @moduledoc"""
  This controller is called from the fall through route in the router.
  The purpose is to handle serving up the 'legacy' angular application using
  the legacy template
  """

  plug CrossroadsInterface.Plug.PutMetaTemplate, "angular_meta_tags.html"
  plug CrossroadsInterface.Plug.Authorized
  plug CrossroadsInterface.Plug.CmsPage
  plug :put_layout, "no_header_or_footer.html"

  @doc """
  When angular can't find a route, it sets a cookie unmatchedLegacyRoute=<route>
  which in turn renders error view and the 404 template
  """
  def index(conn, params) do
    conn |> CrossroadsInterface.Plug.Cookie.delete("redirectingToMaestro")
    if conn.assigns[:page] != nil do
      conn |> CrossroadsInterface.CmsPageController.call(:index)
    else
      conn  
      |> render("app_root.html", %{"js_files": [
          "/js/legacy/ang.js",
          "/js/legacy/core.js",
          "/js/legacy/misc.js",
          "/js/legacy/main.js"
        ], "css_files": [
        "/css/app.css",
        "/js/legacy/legacy.css",
        "/js/legacy/core.css"
        ], "base_href": "/"})
    end
  end

end
