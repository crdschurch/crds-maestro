defmodule CrossroadsInterface.NotfoundController do
  use CrossroadsInterface.Web, :controller
  alias CrossroadsContent.Pages

  plug :put_layout, "no_sidebar.html"
  plug CrossroadsInterface.Plug.Meta
  plug CrossroadsInterface.Plug.ContentBlocks

  def notfound(conn, _params) do
    {:ok, page} = Pages.get_page("/servererror/")
    IO.inspect page
    conn
    |> put_status(404)
    |> render("404.html", %{ payload: page["content"],
      "css_files": [
        "/js/legacy/legacy.css"
      ]
    })
  end

end
