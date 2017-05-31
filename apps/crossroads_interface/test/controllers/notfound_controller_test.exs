defmodule CrossroadsInterface.NotfoundControllerTest do
  use CrossroadsInterface.ConnCase
  alias CrossroadsContent.CmsClient
  alias CrossroadsContent.Pages
  import Mock

  require IEx

  @oops_page %{"bodyClasses" => nil, "canEditType" => nil, "canViewType" => nil,
    "card" => "summary", "className" => "ErrorPage",
    "content" => "<div class=\"push-top\">\n<div class=\"col-sm-5\">\n<h1 class=\"brand-font type-color page-header\">Oops.</h1>\n<h2 class=\"subheading push-bottom\">We're sorry. There seems to
  have been an issue.</h2>\n<p>Please use the navigation above or search here.</p>\n<form role=\"form\" action=\"/search\">\n<div class=\"form-group\">\n<div class=\"input-group input-group-lg\" ui-sref=\"search\" ng-click=\"ok($event)\"><input class=\"form-control input-lg\" type=\"search\" placeholder=\"Search\" name=\"q\"><span class=\"input-group-btn\"> <button type=\"submit\" c
  lass=\"btn btn-default\"> <svg viewbox=\"0 0 32 32\" class=\"icon icon-large icon-search3\"><use xmlns:xlink=\"http://www.w3.org/1999/xlink\" xlink:href=\"#search3\"></use></svg></button> </sp
  an></div>\n</div>\n</form>\n<p class=\"push-top\" mce_advimageresize_id=\"Form_EditForm_Content_mce_0\"><strong>Still need help?</strong> <br>Browse our <a href=\"help\">help section</a>, <a h
  ref=\"mailto:websupport@crossroads.net\">email us</a> or give us a call at 513‑731‑7400.</p>\n</div>\n<div class=\"col-sm-7 push-top\"><img class=\"img-responsive imgix-fluid full-width\" titl
  e=\"404 Page Not Found Crushed Coffee Cup\" data-src=\"//crossroads-media.imgix.net/images/coffee-cup-crushed.jpg\" alt=\"Page not found!\" src=\"http://content.crossroads.net/\" mce_advimager
  esize_id=\"Form_EditForm_Content_mce_1\"></div>\n</div>",
    "created" => "2015-01-21T18:13:56-05:00", "errorCode" => "500",
    "extraMeta" => nil, "hasBrokenFile" => "0", "hasBrokenLink" => "0", "id" => 5,
    "inheritSideBar" => "0", "legacyStyles" => "1", "link" => "/servererror/",
    "menuTitle" => nil, "metaDescription" => nil, "metaKeywords" => nil,
    "pageType" => "ErrorPage", "reportClass" => nil, "requiresAngular" => "0",
    "showInMenus" => "0", "showInSearch" => "0", "sideBar" => 206, "sort" => "57",
    "title" => "Server error", "type" => "website", "uRLSegment" => "servererror",
    "version" => "30"}

  @content_block_call %{"contentBlocks" => [%{"id" => 1, "title" => "generalError"}]}
  @system_page_response %{"systemPages" => [%{"bodyClasses" => nil,
                                              "card" => "summary",
                                              "className" => "SystemPage",
                                              "created" => "2015-09-24T13:52:49-04:00",
                                              "description" => "We are glad you are here. Let's get your account set up!",
                                              "id" => 59,
                                              "keywords" => nil,
                                              "legacyStyles" => "1",
                                              "stateName" => "",
                                              "title" => "Register",
                                              "type" => "website",
                                              "uRL" => "/register"}]}

  test "GET /notfound", %{conn: conn} do
    with_mocks([ {Pages, [], [page_exists?: fn(_path) -> false end]},
                 {CmsClient, [], [get_content_blocks: fn() -> {:ok, 200, @content_block_call} end]},
                 {CmsClient, [], [get_system_page: fn(_anything) -> {:ok, 200, @system_page_response} end]},
                 {Pages, [], [get_page: fn(_url) -> {:ok, @oops_page} end ]},
                 {CmsClient, [], [get_site_config: fn(1) -> {:ok, 200, %{}} end]} ]) do

      conn = get conn, "/notfound"
      assert html_response(conn, 404)
     end
  end

  @tag :skip # not applicable since we mock CMS content
  test "GET /notfound has 404 title", %{conn: conn} do
    with_mocks([ {Pages, [], [page_exists?: fn(_path) -> false end]},
                 {CmsClient, [], [get_content_blocks: fn() -> {:ok, 200, @content_block_call} end]},
                 {CmsClient, [], [get_system_page: fn(_anything) -> {:ok, 200, @system_page_response} end]},
                 {CmsClient, [], [get_page: fn(_url, _stage) -> {:ok, @oops_page} end ]},
                 {CmsClient, [], [get_site_config: fn(1) -> {:ok, 200, %{}} end]} ]) do

      expectedText = "404 Page Not Found"
      conn = get conn, "/notfound"
      assert html_response(conn, 404) =~ expectedText
    end
  end
  
end
