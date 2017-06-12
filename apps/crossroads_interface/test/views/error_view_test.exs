defmodule CrossroadsInterface.ErrorViewTest do
  use CrossroadsInterface.ConnCase
  alias CrossroadsContent.CmsClient
  import Mock

  # Bring render/3 and render_to_string/3 for testing custom views
  import Phoenix.View

  test "renders 404_page.html" do
    with_mock CmsClient, [get_page: fn("/servererror/", false) -> {:ok, 200, fake_error_page} end] do
      assert render_to_string(CrossroadsInterface.ErrorView, "404.html", []) =~ "We're sorry. There seems to have been an issue."
    end
  end

  test "render 500.html" do
    assert render_to_string(CrossroadsInterface.ErrorView, "500.html", []) == "500"
  end

  test "render any other should default to 404" do
    with_mock CmsClient, [get_page: fn("/servererror/", false) -> {:ok, 200, fake_error_page} end] do
      assert render_to_string(CrossroadsInterface.ErrorView, "505.html", []) =~
           "We're sorry. There seems to have been an issue."  end
  end
end
