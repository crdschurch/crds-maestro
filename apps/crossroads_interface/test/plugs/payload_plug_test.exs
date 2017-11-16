defmodule CrossroadsInterface.Plugs.Payload do
  use CrossroadsInterface.ConnCase

  test "Assigns value to :payload when Payload.call() is called", %{conn: _conn} do
    conn = conn() |> CrossroadsInterface.Plug.Payload.call([])
    assert conn.assigns.payload == []
  end

  test "Assigns value to :payload when Payload.call() is called and nil is passed in as an argument", %{conn: _conn} do
    conn = conn() |> CrossroadsInterface.Plug.Payload.call(nil)
    assert conn.assigns.payload == ""
  end
end
