defmodule CrossroadsInterface.ArticlesController do
  use CrossroadsInterface.Web, :controller
  require IEx

  def index(conn, _) do
    {:ok, resp} = HTTPoison.get "https://medium.com/crdschurch/?format=json"
    posts = String.replace_leading(resp.body, "])}while(1);</x>", "")
            |> Poison.decode!
            |> get_in(["payload", "references", "Post"])

    IEx.pry
    render(conn, "index.html", %{posts: posts,
      css_files: [ "/css/app.css", "/js/legacy/legacy.css" ]})
  end

  def show(conn, %{"id" => id}) do
    {:ok, resp} = HTTPoison.get "https://medium.com/crdschurch/#{id}?format=json"
    body = String.replace_leading(resp.body, "])}while(1);</x>", "")
           |> Poison.decode!
    paragraphs = get_in(body, ["payload", "value", "content", "bodyModel", "paragraphs"])
    render(conn, "show.html", %{paragraphs: paragraphs,
      css_files: [ "/css/app.css", "/js/legacy/legacy.css" ]})

  end
end
