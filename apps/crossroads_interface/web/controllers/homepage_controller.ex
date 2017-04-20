defmodule CrossroadsInterface.HomepageController do
  use CrossroadsInterface.Web, :controller
  alias CrossroadsContent.Pages
  require IEx

  plug :put_layout, "screen_width.html"

  def index(conn, _params) do
      IEx.pry
    payload = case Pages.get_page("/", false) do
      {:ok, 200, body} -> Enum.at(body["pages"], 0)["content"]
      {_, _, body} -> "<h2> #{body} </h2>"
    end
    conn
    |> render("index.html", %{ payload: payload,
      "css_files": [
        "/js/legacy/legacy.css"
      ]
    })
    render conn, "index.html"
  end
end