defmodule CrossroadsInterface.PublicationsController do
  use CrossroadsInterface.Web, :controller
  alias CrossroadsInterface.Plug
  alias CrossroadsInterface.NotfoundController
  alias CrossroadsContent.ContentClient
  require IEx
  require Logger

  plug Plug.Meta
  plug Plug.ContentBlocks
  plug Plug.BodyClass, "crds-styles"

  def index(conn, _) do
    articles = ContentClient.get_articles()
    IEx.pry
    case articles do
      {:ok, _response_code, articles} ->
        conn |> render("content.html", %{articles: articles, css_files: [ "/css/app.css", "/js/legacy/legacy.css" ]})
      {:error, _response_code, response_data} ->
        Logger.error("Error getting articles data from content microservice | Response: #{response_data["message"]}")
        NotfoundController.notfound(conn, %{})
      _ ->
        Logger.error("Error getting series data from content microservice")
        NotfoundController.notfound(conn, %{})
    end
  end

  def show(conn, %{"id" => id, "medium" => medium}) do
    IEx.pry
    article = ContentClient.get_article(id)
    conn
    |> assign(:medium, medium)
    |> put_layout("screen_width.html")
    |> render("publication.html", %{
      css_files: [ "/css/app.css", "/js/legacy/legacy.css" ]})
  end

end
