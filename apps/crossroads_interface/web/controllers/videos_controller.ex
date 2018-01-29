defmodule CrossroadsInterface.VideosController do
  use CrossroadsInterface.Web, :controller
  alias CrossroadsInterface.Plug
  alias CrossroadsInterface.NotfoundController

  plug Plug.Meta
  plug Plug.ContentBlocks
  plug Plug.BodyClass, "crds-styles"

  def index do
  end

  def show(conn, %{"id" => id}) do
    conn
    |> put_layout("screen_width.html")
    |> render("individual_video.html", %{
      css_files: [ "/css/app.css", "/js/legacy/legacy.css" ]})
  end
end
