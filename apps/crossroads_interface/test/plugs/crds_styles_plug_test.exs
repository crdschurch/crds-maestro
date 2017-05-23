defmodule CrossroadsInterface.CrdsStylesPlugTest do
  use CrossroadsInterface.ConnCase

  test "given a crds-styles, set it in the assigns", %{conn: conn} do
    conn = conn |> CrossroadsInterface.Plug.CrdsStyles.call("crds-legacy-styles")
    assert conn.assigns.crds_styles == "crds-legacy-styles"
  end

  test "given an emtpy href, set it to the default of blank", %{conn: conn} do
    conn = conn |> CrossroadsInterface.Plug.CrdsStyles.call("")
    assert conn.assigns.crds_styles == ""
  end

end