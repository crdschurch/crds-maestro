defmodule CrossroadsInterface.PublicationsController do
  use CrossroadsInterface.Web, :controller
  alias CrossroadsInterface.Plug
  alias CrossroadsInterface.NotfoundController
  alias CrossroadsContent.PublicationsClient
  require Logger

  plug Plug.Meta
  plug Plug.ContentBlocks
  plug Plug.BodyClass, "crds-styles"

  def index_articles(conn, _) do
    case PublicationsClient.get_articles() do
      {:ok, _response_code, articles} ->
        conn
        |> put_layout("screen_width.html")
        |> render("publications.html", %{ articles: articles,
          css_files: [ "/css/app.css", "/js/legacy/legacy.css" ]})
      {:error, _response_code, response_data} ->
        Logger.error("Error getting Publications | Response: Page Not Found")
        NotfoundController.notfound(conn, %{})
      _ ->
        Logger.error("Error getting Publications")
        NotfoundController.notfound(conn, %{})
    end
  end

  def show_article(conn, %{"id" => id, "source" => source}) do
    case PublicationsClient.get_article(id, source) do
      {:ok, _response_code, article} ->
        conn
        |> put_layout("screen_width.html")
        |> render("article.html", %{ article: article,
          css_files: [ "/css/app.css", "/js/legacy/legacy.css" ]})
      {:error, _response_code, response_data} ->
        Logger.error("Error getting Publications | Response: Article Not Found")
        NotfoundController.notfound(conn, %{})
      _ ->
        Logger.error("Error getting Publications")
        NotfoundController.notfound(conn, %{})
    end
  end

  def show_article(conn, %{"id" => id}) do
    Logger.error("Error getting Publications | Response: Source not provided")
    NotfoundController.notfound(conn, %{})
  end
end
