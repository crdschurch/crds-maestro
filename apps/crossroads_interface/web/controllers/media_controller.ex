defmodule CrossroadsInterface.MediaController do
  use CrossroadsInterface.Web, :controller
  alias CrossroadsContent.Pages
  alias CrossroadsInterface.Plug

  plug Plug.Meta
  plug Plug.ContentBlocks
  plug Plug.BodyClass, "crds-legacy-styles"

  plug :put_layout, "screen_width.html"

  def index(conn, _params) do

    conn
    |> render("media.html",
              "css_files": [
                "/js/legacy/legacy.css"
              ])
  end

end
