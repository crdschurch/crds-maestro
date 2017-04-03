defmodule CrossroadsInterface.CrdsConnectController do
  use CrossroadsInterface.Web, :controller
  require Logger
  require File

  @moduledoc"""
  This controller handles "/connect" (Finder) requests
  """

  plug CrossroadsInterface.Plug.BaseHref, "/connect"
  plug :put_layout, "screen_width.html"

  def index(conn, _params) do
    render conn, "app_root.html", %{ "js_files": [
        "/js/crds_connect/polyfills.js",
        "/js/crds_connect/vendor.js",
        "/js/crds_connect/app.js"
      ], "css_files": [
        "/js/legacy/core.css"
      ]}
  end

end
