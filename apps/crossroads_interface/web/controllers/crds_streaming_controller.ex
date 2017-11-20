defmodule CrossroadsInterface.CrdsStreamingController do
  use CrossroadsInterface.Web, :controller
  require Logger
  require File

  @moduledoc"""
  This controller handles "/streaming" (Finder) requests
  """

  plug CrossroadsInterface.Plug.BaseHref, "/streaming"
  plug CrossroadsInterface.Plug.Meta
  plug CrossroadsInterface.Plug.ContentBlocks
  plug :put_layout, "screen_width.html"

  def index(conn, _params) do
    conn
    |> CrossroadsInterface.Plug.RedirectCookie.call("/streaming")
    |> render("app_root.html", %{"js_files": [
        "/js/crds_streaming/inline.bundle.js",
        "/js/crds_streaming/polyfills.bundle.js",
        "/js/crds_streaming/styles.bundle.js",
        "/js/crds_streaming/vendor.bundle.js",
        "/js/crds_streaming/main.bundle.js"
      ], "css_files": [
        "/css/app.css",
        "/js/legacy/legacy.css",
        "/js/crds_streaming/styles.bundle.css" 
      ]})
  end

end
