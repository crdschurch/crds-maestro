defmodule CrossroadsInterface.NotfoundController do
  use CrossroadsInterface.Web, :controller

  plug :put_layout, "no_sidebar.html"
  plug CrossroadsInterface.Plug.Meta
  plug CrossroadsInterface.Plug.ContentBlocks

  def notfound(conn, _params) do
    conn
    |> CrossroadsInterface.Plug.ContentBlocks.call("")
    |> CrossroadsInterface.Plug.Meta.call("")
    |> CrossroadsInterface.Plug.PutMetaTemplate.call("meta_tags.html")
    |> put_layout("no_sidebar.html")
    |> put_status(404)
    |> render(CrossroadsInterface.ErrorView, "404.html",
        %{"css_files": [ "/js/app.css", "/js/legacy/legacy.css" ]})
   end
end
