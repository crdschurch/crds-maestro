defmodule CrossroadsInterface.Plugs.Payload do
  use CrossroadsInterface.ConnCase

  test "Assigns value to :payload when request to a route is made", %{conn: conn} do
    conn = get conn, "/"
    assert conn.assigns.payload == []
  end
end
