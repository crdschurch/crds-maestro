defmodule CrossroadsInterface.ErrorViewTest do
  use CrossroadsInterface.ConnCase, async: true

  # Bring render/3 and render_to_string/3 for testing custom views
  import Phoenix.View

  test "renders 404_page.html" do
    assert render_to_string(CrossroadsInterface.ErrorView, "404.html", []) =~ 
           "<p class=\"push-top\"><strong>Still need help?</strong> <br />Browse our <a href=\"help\">help section</a>, <a href=\"mailto:websupport@crossroads.net\">email us</a> or give us a call at 513‑731‑7400.</p>"
  end

  test "render 500.html" do
    assert render_to_string(CrossroadsInterface.ErrorView, "500.html", []) ==
           "500"
  end

  test "render any other should default to 404" do
    assert render_to_string(CrossroadsInterface.ErrorView, "505.html", []) =~
           "<p class=\"push-top\"><strong>Still need help?</strong> <br />Browse our <a href=\"help\">help section</a>, <a href=\"mailto:websupport@crossroads.net\">email us</a> or give us a call at 513‑731‑7400.</p>"  end
end
