defmodule CrossroadsInterface.MediaController do
  use CrossroadsInterface.Web, :controller
  alias CrossroadsContent.Pages
  alias CrossroadsInterface.Plug

  plug Plug.Meta
  plug Plug.ContentBlocks
  plug Plug.BodyClass, "crds-legacy-styles"

  plug :put_layout, "screen_width.html"

  def index(conn, _params) do
    payload = case Pages.get_series_all do
      {:ok, 200, body} -> Enum.at(body["series"], 0)["title"]
      {_, _, body} -> body
    end
    conn
    |> render("media.html", %{ payload: payload,
      "css_files": [
      "/js/legacy/legacy.css"
      ]
    })
  end

end
