defmodule CrossroadsInterface.CrdsGroupLeaderController do
  use CrossroadsInterface.Web, :controller
  require Logger

  @moduledoc"""
  Handles all requests to /group-leader
  """
  plug :put_layout, "no_sidebar.html"
  plug CrossroadsInterface.Plug.BaseHref, "/group-leader"
  plug CrossroadsInterface.Plug.ContentBlocks
  plug CrossroadsInterface.Plug.Meta

  def index(conn, _params) do
    conn
    |> CrossroadsInterface.Plug.RedirectCookie.call("/group-leader")
    |> render("app_root.html", %{"js_files": [
        "/js/group_leader/inline.bundle.js",
        "/js/group_leader/polyfills.bundle.js",
        "/js/group_leader/styles.bundle.js",
        "/js/group_leader/vendor.bundle.js",
        "/js/group_leader/main.bundle.js"
      ], "css_files": [ 
        "/css/app.css",
        "/js/legacy/legacy.css",
        "/js/group_leader/styles.bundle.css" 
      ]})
  end

end
