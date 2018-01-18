defmodule CrossroadsInterface.CmsPageController do
  use CrossroadsInterface.Web, :controller
  alias CrossroadsInterface.Plug.RedirectCookie
  alias CrossroadsInterface.Plug.Authorized
  plug CrossroadsInterface.Plug.PutMetaTemplate, "meta_tags.html"
  plug CrossroadsInterface.Plug.Meta
  plug CrossroadsInterface.Plug.ContentBlocks

  def index(conn, _) do
    page = conn.assigns[:page]

    cond do
      page["redirectUrl"] != nil ->
        conn |> redirect(external: page["redirectUrl"])
      page["canViewType"] == "LoggedInUsers" ->
        conn =
          conn
          |> Authorized.call([])
          |> RedirectCookie.call(conn.assigns[:path])
        if conn.assigns.authorized do
          renderPage(conn, page)
        else
          conn
          |> redirect(to: "/signin")
        end
      true ->
        renderPage(conn, page)
    end
  end

  defp renderPage(conn, page) do
    crds_styles = getStylesClassFromPage(page)
    body_class = getBodyClassFromPage(page)
    layout = getLayoutFromPage(page)
    conn
    |> RedirectCookie.call(conn.assigns[:path])
    |> put_layout(layout)
    |> assign(:body_class, body_class)
    |> assign(:crds_styles, crds_styles)
    |> render(CrossroadsInterface.CmsPageView,
            "index.html",
            %{payload: page["content"],
              css_files: [ "/css/app.css", "/js/legacy/legacy.css" ]})
  end

  defp getStylesClassFromPage(page) do
    case page["legacyStyles"] do
      "0" -> "crds-styles"
      "1" -> "crds-legacy-styles"
      _ -> ""
    end
  end

  defp getBodyClassFromPage(page) do
    if page["bodyClasses"] do
      String.replace(page["bodyClasses"], ",", " ")
    end
  end

  defp getLayoutFromPage(page) do
    case page["pageType"] do
      "NoHeaderOrFooter" -> "no_header_or_footer.html"
      "ScreenWidth" -> "screen_width.html"
      "HomePage" -> "home_page.html"
      "CenteredContentPage" -> "centered_content_page.html"
      "GoCincinnati" -> "go_cincinnati.html"
      _ -> "no_sidebar.html"
    end
  end
end
