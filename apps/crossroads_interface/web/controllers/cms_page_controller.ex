defmodule CrossroadsInterface.CmsPageController do
  use CrossroadsInterface.Web, :controller

  plug CrossroadsInterface.Plug.PutMetaTemplate, "meta_tags.html"
  plug CrossroadsInterface.Plug.Meta
  plug CrossroadsInterface.Plug.ContentBlocks

  def index(conn, _) do
    page = conn.assigns[:page]

    if page["redirectUrl"] != nil do
      conn |> redirect(external: page["redirectUrl"])
    else
      crds_styles = getStylesClassFromPage(page)
      body_class = getBodyClassFromPage(page)
      layout = getLayoutFromPage(page)
      conn
        |> CrossroadsInterface.Plug.RedirectCookie.call("content", "{\"link\":\"#{conn.assigns[:path]}\"}")
        |> put_layout(layout)
        |> assign(:body_class, body_class)
        |> assign(:crds_styles, crds_styles)
        |> render(CrossroadsInterface.CmsPageView, "index.html", %{payload: page["content"],
        "css_files": ["/css/app.css", "/js/legacy/legacy.css"]})
    end
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
