defmodule CrossroadsInterface.CrdsConnectController do
  use CrossroadsInterface.Web, :controller
  require Logger
  require File

  @moduledoc"""
  This controller handles "/connect" (Finder) requests
  """
  plug :put_layout, "screen_width.html"
  plug CrossroadsInterface.Plug.BaseHref, "/connect"
  plug CrossroadsInterface.Plug.ContentBlocks
  plug CrossroadsInterface.Plug.Meta
  plug CrossroadsInterface.Plug.CrdsStyles, "crds-styles"

  def index(conn, _params) do
    conn
      |> CrossroadsInterface.Plug.RedirectCookie.call("/connect")
      |> render("app_root.html", %{ "js_files": [
        "/js/crds_connect/inline.bundle.js",
        "/js/crds_connect/polyfills.bundle.js",
        "/js/crds_connect/styles.bundle.js",
        "/js/crds_connect/main.bundle.js"
        ], "css_files": [
          "/js/legacy/legacy.css"
        ]})
  end

end
