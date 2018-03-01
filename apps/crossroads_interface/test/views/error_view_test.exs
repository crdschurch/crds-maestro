defmodule CrossroadsInterface.ErrorViewTest do
  use CrossroadsInterface.ConnCase
  alias CrossroadsContent.CmsClient
  import Mock

  # Bring render/3 and render_to_string/3 for testing custom views
  import Phoenix.View

  describe "ErrorView" do
    test "renders 404_page.html" do
      with_mock CmsClient, [get_page: fn("/page-not-found/", false) -> {:ok, 200, fake_not_found_page()} end] do
        assert render_to_string(CrossroadsInterface.ErrorView, "404.html", []) =~ "We\'re sorry. That page doesn\'t seem to exist."
      end
    end

    test "renders 500.html" do
      with_mock CmsClient, [get_page: fn("/servererror/", false) -> {:ok, 200, fake_server_error_page()} end] do
        assert render_to_string(CrossroadsInterface.ErrorView, "500.html", []) =~ "500"
      end
    end

    test "renders any other should default to 404" do
      with_mock CmsClient, [get_page: fn("/page-not-found/", false) -> {:ok, 200, fake_not_found_page()} end] do
        assert render_to_string(CrossroadsInterface.ErrorView, "505.html", []) =~
        "We're sorry. That page doesn't seem to exist."
      end
    end
  end
end
