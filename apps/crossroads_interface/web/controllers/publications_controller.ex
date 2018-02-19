defmodule CrossroadsInterface.PublicationsController do
  use CrossroadsInterface.Web, :controller
  alias CrossroadsInterface.Plug
  alias CrossroadsInterface.NotfoundController
  require IEx

  plug Plug.Meta
  plug Plug.ContentBlocks
  plug Plug.BodyClass, "crds-styles"

  def indexArticles(conn, _) do
    {:ok, resp} = HTTPoison.get "http://localhost:5000/api/content/articles"
    %{body: posts, headers: _headers, request_url: _req, status_code: _stat} = resp

    articles = Poison.decode!(posts)

    conn
    |> put_layout("screen_width.html")
    |> render("publications.html", %{ articles: articles,
      css_files: [ "/css/app.css", "/js/legacy/legacy.css" ]})
  end

  def showArticle(conn, %{"id" => id}) do
    {:ok, resp} = HTTPoison.get "http://localhost:8080/api/articles/#{id}"
    %{body: body, headers: _, request_url: _, status_code: _} = resp
    %{"article" => article} = Poison.decode!(body)

    conn
    |> put_layout("screen_width.html")
    |> render("article.html", %{ article: article,
      css_files: [ "/css/app.css", "/js/legacy/legacy.css" ]})  
  end

end
