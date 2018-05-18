defmodule CrossroadsInterface.LegacyController do
  require Logger
  use CrossroadsInterface.Web, :controller

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
  Sending a list of paths to angular legacy in a cookie so it knows which routes to send back to maestro
  """
  def index(conn, params) do
    if conn.assigns[:page] != nil do
      conn |> CrossroadsInterface.CmsPageController.call(:index)
    else
      conn
      |> CrossroadsInterface.Plug.Cookie.call("maestro-pages", "group-leader,connect,groups,series,publications/articles,notfound,homepage,explore,atriumevents")
      |> CrossroadsInterface.Plug.GroupsToSignin.call()
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
