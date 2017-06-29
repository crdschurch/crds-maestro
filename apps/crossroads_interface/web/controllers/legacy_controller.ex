defmodule CrossroadsInterface.LegacyController do
  use CrossroadsInterface.Web, :controller
  require IEx
  @moduledoc"""
  This controller is called from the fall through route in the router.
  The purpose is to handle serving up the 'legacy' angular application using
  the legacy template
  """

  plug CrossroadsInterface.Plug.PutMetaTemplate, "angular_meta_tags.html"
  plug CrossroadsInterface.Plug.Authorized
  plug :put_layout, "no_header_or_footer.html"

  def index(conn, %{ "resolve" => "true" }) do
    conn |> redirect( to: "/notfound")
  end

  def index(conn, params) do
    conn
    |> CrossroadsInterface.Plug.RedirectCookie.call("/")
    |> renderSite( conn: conn, params: params)
  end

  def noRedirect(conn, params) do
    conn |> renderSite( conn: conn, params: params)
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

  defp renderLegacyApp(conn, _params) do
    conn |> render("app_root.html", %{ "js_files": [
        "/js/legacy/ang.js",
        "/js/legacy/core.js",
        "/js/legacy/main.js"
      ], "css_files": [
       "/js/legacy/legacy.css"
      ], "base_href": "/"})
  end
end
