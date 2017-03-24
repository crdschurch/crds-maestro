defmodule CrossroadsInterface.NotfoundController do
  use CrossroadsInterface.Web, :controller
  require IEx
  alias CrossroadsContent.Pages

  plug :put_layout, "no_sidebar.html"

  def notfound(conn, _params) do
    IEx.pry()
    payload = case Pages.get_page("/servererror/", false) do
      {:ok, 200, body} -> Enum.at(body["pages"], 0)["content"]
      {_, _, body} -> "<h2> #{body} </h2>"
    end
    conn
    |> render("404.html", %{ payload: payload, 
      "css_files": [
        "/js/legacy/core.css"
      ]
    })
  end

end
