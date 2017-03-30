defmodule CrossroadsInterface.CrdsGroupLeaderController do
  use CrossroadsInterface.Web, :controller
  require Logger
  require IEx

  @moduledoc"""
  Handles all requests to /group-leader
  """
  plug :put_layout, "no_sidebar.html"

  def index(conn, _params) do
    render conn, "app_root.html", %{ "js_files": [
        "/js/group-leader/inline.bundle.js",
        "/js/group-leader/polyfills.bundle.js",
        "/js/group-leader/styles.bundle.js",
        "/js/group-leader/vendor.bundle.js",
        "/js/group-leader/main.bundle.js"
      ], "base_href": "/group-leader" }
  end

end
