defmodule CrossroadsInterface.CrdsSrfpController do
    use CrossroadsInterface.Web, :controller
    require Logger
    require File
  
    @moduledoc"""
    This controller handles /srfp
    """
  
    plug :put_layout, "screen_width.html"
    plug CrossroadsInterface.Plug.BaseHref, "/srfp"
    plug CrossroadsInterface.Plug.ContentBlocks
    plug CrossroadsInterface.Plug.Meta
    plug CrossroadsInterface.Plug.CrdsStyles, "crds-styles"
  
    def index(conn, _params) do
      conn
        |> CrossroadsInterface.Plug.RedirectCookie.call("/srfp")
        |> render("app_root.html", %{ "js_files": [
            "/js/srfp_assessment/inline.bundle.js",
            "/js/srfp_assessment/polyfills.bundle.js",
            "/js/srfp_assessment/styles.bundle.js",
            "/js/srfp_assessment/main.bundle.js"
          ], "css_files": [
            "/js/legacy/legacy.css",
            "/js/srfp_assessment/styles.bundle.css"
          ]})
    end
  
  end
  