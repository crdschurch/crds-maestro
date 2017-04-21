defmodule CrossroadsInterface.HomepageController do
  use CrossroadsInterface.Web, :controller
  alias CrossroadsContent.Pages
  require IEx

  plug :put_layout, "screen_width.html"

  def index(conn, _params) do
    if conn.assigns[:authorized] do
      conn
      |> render("authorized_index.html",
                "css_files": [
                  "/js/legacy/legacy.css"
                ])
    else
      conn
      |> render("not_authorized_index.html",
                "css_files": [
                  "/js/legacy/legacy.css"
                ])
    end
  end
end
