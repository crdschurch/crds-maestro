defmodule CrossroadsInterface.BaseHrefPlugTest do
  use CrossroadsInterface.ConnCase

  test "given a base href, set it in the assigns", %{conn: conn} do
    conn = conn |> CrossroadsInterface.Plug.BaseHref.call("/angular2")
    assert conn.assigns[:base_href] == "/angular2"
  end

  test "given an empty href, do not set it", %{conn: conn} do
    conn = conn |> CrossroadsInterface.Plug.BaseHref.call([])
    assert conn.assigns[:base_href] == nil
  end

end
