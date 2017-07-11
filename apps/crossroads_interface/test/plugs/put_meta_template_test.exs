defmodule CrossroadsInterface.PutMetaTemplateTest do
  use CrossroadsInterface.ConnCase

  @default_meta_template "meta_tags.html"
  @test_meta_template "meta_test_template.html"

  test "given a meta_template, set it in the assigns", %{conn: conn} do
    conn = conn |> CrossroadsInterface.Plug.PutMetaTemplate.call(@test_meta_template)
    assert conn.assigns.meta_template == @test_meta_template
  end

  test "given an empty meta_template, set it to the default", %{conn: conn} do
    conn = conn |> CrossroadsInterface.Plug.PutMetaTemplate.call([])
    assert conn.assigns.meta_template == @default_meta_template
  end

end
