defmodule CrossroadsInterface.NotfoundController do
  use CrossroadsInterface.Web, :controller
  alias CrossroadsContent.CmsClient
  require IEx

  plug :put_layout, "no_sidebar.html"
  plug CrossroadsInterface.Plug.Meta
  plug CrossroadsInterface.Plug.ContentBlocks

  def notfound(conn, _params) do
    case CmsClient.get_page("/servererror/", false) do
      {:ok, _, body} -> conn |> renderPageContent(List.first(body["pages"]))
      _ -> conn |> put_status(404) |> render("404.html")
    end    
  end

  defp renderPageContent(conn, page) do
    conn
    |> put_status(404)
    |> render("404.html", %{payload: page["content"],
      "css_files": [
        "/css/app.css",
        "/js/legacy/legacy.css"
      ]
    })
  end
end
