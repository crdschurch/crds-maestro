defmodule CrossroadsInterface.HomepageController do
  use CrossroadsInterface.Web, :controller
  alias CrossroadsContent.Pages
  require IEx

  plug :put_layout, "screen_width.html"

  def index(conn, _params) do
    page = case conn.assigns[:authorized] do
      true -> "authorized_index.html"
      false -> "not_authorized_index.html"
    end

    conn
    |> render(page,
              "css_files": [
                "/js/legacy/legacy.css"
              ])
  end
end
