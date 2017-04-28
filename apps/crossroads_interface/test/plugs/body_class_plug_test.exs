defmodule CrossroadsInterface.BodyClassPlugTest do
  use CrossroadsInterface.ConnCase

  test "given a base href, set it in the assigns", %{conn: conn} do
    conn = conn |> CrossroadsInterface.Plug.BodyClass.call("crds-legacy-styles")
    assert conn.assigns.body_class == "crds-legacy-styles"
  end

  test "given an emtpy href, set it to the default of /", %{conn: conn} do
    conn = conn |> CrossroadsInterface.Plug.BodyClass.call("")
    assert conn.assigns.body_class == ""
  end

end

