defmodule CrossroadsInterface.CrdsConnectControllerTest do
  use CrossroadsInterface.ConnCase

  test "GET /connect", %{conn: conn} do
    conn = get conn, "/connect"
    assert html_response(conn, 200)
  end
end

