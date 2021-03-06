defmodule CrossroadsInterface.HomepageController do
  use CrossroadsInterface.Web, :controller
  alias CrossroadsInterface.Plug

  plug Plug.Meta
  plug Plug.ContentBlocks
  plug CrossroadsInterface.Plug.Authorized
  plug Plug.BodyClass, "crds-legacy-styles"

  plug :put_layout, "screen_width.html"

  def index(conn, _params) do
    page = case conn.assigns[:authorized] do
      true -> "authorized_index.html"
      false -> "not_authorized_index.html"
    end

    conn
    |> render(page,
              "css_files": [
                "/css/app.css",
                "/js/legacy/legacy.css"
              ])
  end
end
