defmodule CrossroadsInterface.CrdsGroupsController do
  use CrossroadsInterface.Web, :controller
  require Logger
  require File

  @moduledoc"""
  This controller handles "/groups" (Finder) requests
  """

  plug :put_layout, "screen_width.html"
  plug CrossroadsInterface.Plug.BaseHref, "/groupsv2"
  plug CrossroadsInterface.Plug.ContentBlocks
  plug CrossroadsInterface.Plug.Meta

  def index(conn, _params) do
    conn
      |> CrossroadsInterface.Plug.RedirectCookie.call("/groupsv2")
      |> render("app_root.html", %{ "js_files": [
          "/js/crds_connect/polyfills.js",
          "/js/crds_connect/vendor.js",
          "/js/crds_connect/app.js"
        ], "css_files": [
          "/js/legacy/legacy.css"
        ], "base_href": "/"})
  end

end
