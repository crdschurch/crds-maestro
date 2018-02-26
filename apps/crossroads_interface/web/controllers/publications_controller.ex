defmodule CrossroadsInterface.PublicationsController do
  use CrossroadsInterface.Web, :controller
  alias CrossroadsInterface.Plug
  alias CrossroadsContent.PublicationsClient

  plug Plug.Meta
  plug Plug.ContentBlocks
  plug Plug.BodyClass, "crds-styles"

  def index_articles(conn, _) do
    {:ok, 200, articles} = PublicationsClient.get_articles()

    conn
    |> put_layout("screen_width.html")
    |> render("publications.html", %{ articles: articles,
      css_files: [ "/css/app.css", "/js/legacy/legacy.css" ]})
  end

  def show_article(conn, %{"id" => id, "source" => source}) do
    resp = PublicationsClient.get_article(id, source)
    {:ok, 200, article} = resp

    conn
    |> put_layout("screen_width.html")
    |> render("article.html", %{ article: article,
      css_files: [ "/css/app.css", "/js/legacy/legacy.css" ]})  
  end

end
