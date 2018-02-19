defmodule CrossroadsInterface.ArticlesController do
  use CrossroadsInterface.Web, :controller
  alias CrossroadsInterface.Plug

  plug Plug.Meta
  plug Plug.ContentBlocks
  plug Plug.BodyClass, "crds-styles"
  require IEx


  def index(conn, _) do
    {:ok, resp} = HTTPoison.get "http://localhost:5000/api/content/articles"
    %{body: posts, headers: _headers, request_url: _req, status_code: _stat} = resp

    IEx.pry
    posts = Poison.decode!(posts)

    conn
    |> put_layout("screen_width.html")
    |> render("index.html", %{ posts: posts,
      css_files: [ "/css/app.css", "/js/legacy/legacy.css" ]})
  end
end
