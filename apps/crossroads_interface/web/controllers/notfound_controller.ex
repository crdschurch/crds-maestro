defmodule CrossroadsInterface.NotfoundController do
  use CrossroadsInterface.Web, :controller
  alias CrossroadsContent.Pages

  plug :put_layout, "no_sidebar.html"
  plug CrossroadsInterface.Plug.Meta
  plug CrossroadsInterface.Plug.ContentBlocks

  def notfound(conn, _params) do
    payload = case Pages.get_page("/servererror/") do
      {:ok, 200, body} -> Enum.at(body["pages"], 0)["content"]
      {_, _, body} -> "<h2> #{body} </h2>"
    end
    conn
    |> put_status(404)
    |> render("404.html", %{ payload: payload,
      "css_files": [
        "/js/legacy/legacy.css"
      ]
    })
  end

end
