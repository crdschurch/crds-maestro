defmodule CrossroadsInterface.CrdsConnectController do
  use CrossroadsInterface.Web, :controller
  require Logger
  require File
  require IEx

  @moduledoc"""
  This controller handles "/connect" (Finder) requests
  """

  plug CrossroadsInterface.Plug.BaseHref, "/connect"
  plug :put_layout, "screen_width.html"

  def index(conn, _params) do
    IEx.pry
    conn
      |> put_resp_cookie("redirectUrl", conn.request_path, http_only: false)
      |> render("app_root.html", %{ "js_files": [
          "/js/crds_connect/polyfills.js",
          "/js/crds_connect/vendor.js",
          "/js/crds_connect/app.js"
        ], "css_files": [
          "/js/legacy/legacy.css"
        ]})
  end

end
