defmodule CrossroadsInterface.Plugs.PageType do
  use CrossroadsInterface.ConnCase

  test "Sets default page type to no_sidebar.html when request to a route is made", %{conn: conn} do
    conn = conn |> CrossroadsInterface.Plug.PageType.call("no_sidebar.html")
    assert conn.assigns.page_type == "no_sidebar.html"
  end
end

