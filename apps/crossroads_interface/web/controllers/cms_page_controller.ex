defmodule CrossroadsInterface.CmsPageController do
  require IEx
  use CrossroadsInterface.Web, :controller
  alias CrossroadsContent.Pages

  plug :put_layout, "no_sidebar.html"
  plug CrossroadsInterface.Plug.Meta
  plug CrossroadsInterface.Plug.ContentBlocks

  def index(conn, _params) do
    IEx.pry()
    payload = case Pages.get_page("#{conn.request_path}/", false) do
      {:ok, 200, body} -> Enum.at(body["pages"], 0)["content"]
      {_, _, body} -> "<h2>#{body}</h2>"
    end
    conn
    |> render("index.html", %{ payload: payload,
      "css_files": [
        "/js/legacy/legacy.css"
      ]
    })
  end
end
