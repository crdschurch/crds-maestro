defmodule CrossroadsInterface.LegacyController do
  use CrossroadsInterface.Web, :controller
  @moduledoc"""
  This controller is called from the fall through route in the router.
  The purpose is to handle serving up the 'legacy' angular application using
  the legacy template
  """

  plug CrossroadsInterface.Plug.PutMetaTemplate, "angular_meta_tags.html"
  plug CrossroadsInterface.Plug.Authorized
  plug :put_layout, "no_header_or_footer.html"

  @doc """
  When angular can't find a route, it sends a request back with ?resolve=true
  which in turn renders error view and the 404 template
  """
  def index(conn, params) do
    conn |> assign(:redirect, true) |> renderSite(params)
  end

  def noRedirect(conn, params) do
    conn |> assign(:redirect, false) |> renderSite(params)
  end

  defp renderSite(conn, params) do
    path = conn.request_path |> ContentHelpers.add_trailing_slash_if_necessary
    case CrossroadsContent.Pages.get_page(determine_authorized_path(conn, path),
                                          ContentHelpers.is_stage_request?(conn.params)) do      
      {:ok, page}      
        -> conn
          |> assign(:path, path)
          |> assign(:page, page)
          |> CrossroadsInterface.CmsPageController.call(:index)
      _
        -> conn
          |> renderLegacyApp(params)
    end
  end

  def determine_authorized_path(conn, path) do
    case path do
      "/" -> return_root_by_authentication_status(conn)
      _ -> path
    end
  end

  defp return_root_by_authentication_status(conn) do
    case conn.assigns[:authorized] do
      true -> "/personalized/"
      false -> "/"
      _ -> "/"
    end
  end

  defp renderLegacyApp(conn, %{ "resolve" => "true" }) do
    conn
    |> CrossroadsInterface.Plug.ContentBlocks.call("")
    |> CrossroadsInterface.Plug.Meta.call("")
    |> CrossroadsInterface.Plug.PutMetaTemplate.call("meta_tags.html")
    |> put_layout("no_sidebar.html")
    |> put_status(404)
    |> render(CrossroadsInterface.ErrorView, "404.html",
        %{"css_files": [ "/js/legacy/legacy.css" ]})
  end

  defp renderLegacyApp(conn, _params) do
    if conn.assigns[:redirect] do
      conn |> CrossroadsInterface.Plug.RedirectCookie.call(conn.request_path)
    end
    conn |> render("app_root.html", %{"js_files": [
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
