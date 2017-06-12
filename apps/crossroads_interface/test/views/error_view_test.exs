defmodule CrossroadsInterface.ErrorViewTest do
  use CrossroadsInterface.ConnCase
  alias CrossroadsContent.CmsClient
  import Mock

  # Bring render/3 and render_to_string/3 for testing custom views
  import Phoenix.View

  @get_page_response %{"pages" => [%{"bodyClasses" => nil, "canEditType" => nil,
             "canViewType" => nil, "card" => "summary", "className" => "ErrorPage",
             "content" => "<div class=\"push-top\">\n<div class=\"col-sm-5\">\n<h1 class=\"brand-font type-color page-header\">Oops.</h1>\n<h2 class=\"subheading push-bottom\">We're sorry. There seems to have been an issue.</h2>\n<p>Please use the navigation above or search here.</p>\n<form role=\"form\" action=\"/search\">\n<div class=\"form-group\">\n<div class=\"input-group input-group-lg\" ui-sref=\"search\" ng-click=\"ok($event)\"><input class=\"form-control input-lg\" type=\"search\" placeholder=\"Search\" name=\"q\"><span class=\"input-group-btn\"> <button type=\"submit\" class=\"btn btn-default\"> <svg viewbox=\"0 0 32 32\" class=\"icon icon-large icon-search3\"><use xmlns:xlink=\"http://www.w3.org/1999/xlink\" xlink:href=\"#search3\"></use></svg></button> </span></div>\n</div>\n</form>\n<p class=\"push-top\" mce_advimageresize_id=\"Form_EditForm_Content_mce_0\"><strong>Still need help?</strong> <br>Browse our <a href=\"help\">help section</a>, <a href=\"mailto:websupport@crossroads.net\">email us</a> or give us a call at 513‑731‑7400.</p>\n</div>\n<div class=\"col-sm-7 push-top\"><img class=\"img-responsive imgix-fluid full-width\" title=\"404 Page Not Found Crushed Coffee Cup\" data-src=\"//crossroads-media.imgix.net/images/coffee-cup-crushed.jpg\" alt=\"Page not found!\" src=\"http://content.crossroads.net/\" mce_advimageresize_id=\"Form_EditForm_Content_mce_1\"></div>\n</div>",
             "created" => "2015-01-21T18:13:56-05:00", "errorCode" => "500",
             "extraMeta" => nil, "hasBrokenFile" => "0", "hasBrokenLink" => "0",
             "id" => 5, "inheritSideBar" => "0", "legacyStyles" => "1",
             "link" => "/servererror/", "menuTitle" => nil, "metaDescription" => nil,
             "metaKeywords" => nil, "pageType" => "ErrorPage", "reportClass" => nil,
             "requiresAngular" => "1", "showInMenus" => "0", "showInSearch" => "0",
             "sideBar" => 206, "sort" => "57", "title" => "Server error",
             "type" => "website", "uRLSegment" => "servererror", "version" => "32"}]}

  test "renders 404_page.html" do
    with_mock CmsClient, [get_page: fn("/servererror/", false) -> {:ok, 200, @get_page_response} end] do
      assert render_to_string(CrossroadsInterface.ErrorView, "404.html", []) =~ "We're sorry. There seems to have been an issue."
    end
  end

  test "render 500.html" do
    assert render_to_string(CrossroadsInterface.ErrorView, "500.html", []) == "500"
  end

  test "render any other should default to 404" do
    with_mock CmsClient, [get_page: fn("/servererror/", false) -> {:ok, 200, @get_page_response} end] do
      assert render_to_string(CrossroadsInterface.ErrorView, "505.html", []) =~
           "We're sorry. There seems to have been an issue."  end
  end
end
