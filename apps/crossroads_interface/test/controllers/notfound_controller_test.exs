defmodule CrossroadsInterface.NotfoundControllerTest do
  use CrossroadsInterface.ConnCase

  test "GET /notfound", %{conn: conn} do
    conn = get conn, "/notfound"
    assert html_response(conn, 200)
  end

  test "GET /notfound has 404 title", %{conn: conn} do
    expectedText = "404 Page Not Found"
    conn = get conn, "/notfound"
    assert html_response(conn, 200) =~ expectedText
  end
  
end
