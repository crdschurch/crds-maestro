defmodule CrossroadsInterface.CrdsGroupsController do
  use CrossroadsInterface.Web, :controller
  require Logger
  require File

  @moduledoc"""
  This controller handles "/groups" (Finder) requests
  """

  plug :put_layout, "screen_width.html"
  plug CrossroadsInterface.Plug.BaseHref, "/groups/search"
  plug CrossroadsInterface.Plug.ContentBlocks
  plug CrossroadsInterface.Plug.Meta
  plug CrossroadsInterface.Plug.CrdsStyles, "crds-styles"

  def index(conn, _params) do
    conn
      |> CrossroadsInterface.Plug.RedirectCookie.call("/groups/search")
      |> render("app_root.html", %{ "js_files": [
        "/js/crds_connect/inline.bundle.js",
        "/js/crds_connect/polyfills.bundle.js",
        "/js/crds_connect/main.bundle.js",
        "/js/crds_connect/styles.bundle.js",
        ], "css_files": [
          "/js/legacy/legacy.css",
          "/js/crds_connect/styles.bundle.css"
        ]})
  end

end
