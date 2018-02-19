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

    posts = Poison.decode!(posts)

    conn
    |> put_layout("screen_width.html")
    |> render("article_index.html", %{ posts: posts,
      css_files: [ "/css/app.css", "/js/legacy/legacy.css" ]})
  end

  def indexVideos(conn, _) do
    {:ok, resp} = HTTPoison.get "http://localhost:5000/api/content/articles"
    %{body: videos, headers: _headers, request_url: _req, status_code: _stat} = resp

    videos = Poison.decode!(videos)

    conn
    |> put_layout("screen_width.html")
    |> render("article_index.html", %{ videos: videos,
      css_files: [ "/css/app.css", "/js/legacy/legacy.css" ]})
  end

  def showArticle(conn, %{"id" => id}) do
    {:ok, resp} = HTTPoison.get "http://localhost:8080/api/articles/#{id}"
    %{body: body, headers: _, request_url: _, status_code: _} = resp
    %{"article" => article} = Poison.decode!(body)

    conn
    |> put_layout("screen_width.html")
    |> render("article.html", %{ content: article,
      css_files: [ "/css/app.css", "/js/legacy/legacy.css" ]})  
  end

  # def showVideo(conn, %{"id" => id}) do
  #   content = get_content()
  #   conn
  #   |> assign(:content, content)
  #   |> put_layout("screen_width.html")
  #   |> render("video.html", %{
  #     css_files: [ "/css/app.css", "/js/legacy/legacy.css" ]})  
  # end
end
