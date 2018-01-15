defmodule CrossroadsInterface.ArticlesController do
  use CrossroadsInterface.Web, :controller
  alias CrossroadsInterface.Plug

  plug Plug.Meta
  plug Plug.ContentBlocks
  plug Plug.BodyClass, "crds-styles"


  def index(conn, _) do
    {:ok, resp} = HTTPoison.get "https://medium.com/crdschurch/?format=json"
    posts = String.replace_leading(resp.body, "])}while(1);</x>", "")
            |> Poison.decode!
            |> get_in(["payload", "references", "Post"])
    posts = prepare_posts(posts)

    conn
    |> put_layout("screen_width.html")
    |> render("index.html", %{posts: posts,
      css_files: [ "/css/app.css", "/js/legacy/legacy.css" ]})
  end

  def show(conn, %{"id" => id}) do
    {:ok, resp} = HTTPoison.get "https://medium.com/crdschurch/#{id}?format=json"
    body = String.replace_leading(resp.body, "])}while(1);</x>", "")
           |> Poison.decode!
    paragraphs = get_in(body, ["payload", "value", "content", "bodyModel", "paragraphs"])

    conn
    |> put_layout("centered_content_page.html")
    |> render("show.html", %{paragraphs: paragraphs,
      css_files: [ "/css/app.css", "/js/legacy/legacy.css" ]})
  end

  defp prepare_posts(posts) do
    Enum.map(posts, fn(post) ->
      {id, body} = post

      %{title: body["title"], id: body["id"], slug: body["uniqueSlug"],
        subtitle: body["content"]["subtitle"],
        word_count: body["virtuals"]["wordCount"],
        reading_time: body["virtuals"]["readingTime"],
        image: body["virtuals"]["previewImage"]["imageId"]}
    end)
  end
end
