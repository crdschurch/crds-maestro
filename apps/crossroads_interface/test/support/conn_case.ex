defmodule CrossroadsInterface.ConnCase do
  @moduledoc """
  This module defines the test case to be used by
  tests that require setting up a connection.

  Such tests rely on `Phoenix.ConnTest` and also
  imports other functionality to make it easier
  to build and query models.

  Finally, if the test case interacts with the database,
  it cannot be async. For this reason, every test runs
  inside a transaction which is reset at the beginning
  of the test unless the test case is marked as async.
  """

  use ExUnit.CaseTemplate

  using do
    quote do
      # Import conveniences for testing with connections
      use Phoenix.ConnTest

      import CrossroadsInterface.Router.Helpers

      # The default endpoint for testing
      @endpoint CrossroadsInterface.Endpoint

      def fake_content_blocks() do
        %{"contentBlocks" => [%{"id" => 1, "title" => "generalError"}]}
      end

      def fake_not_found_page() do
        %{"pages" => [%{
          "content" => "<div class=\"push-top\">\n<div class=\"col-sm-5\">\n<h1 class=\"brand-font type-color page-header\">Oops.</h1>\n<h2 class=\"subheading push-bottom\">We're sorry. That page doesn't seem to exist.</h2>\n<p>Please use the navigation above or search here.</p>\n<form role=\"form\" action=\"/search\">\n<div class=\"form-group\">\n<div class=\"input-group input-group-lg\" ui-sref=\"search\" ng-click=\"ok($event)\"><input class=\"form-control input-lg\" type=\"search\" placeholder=\"Search\" name=\"q\"><span class=\"input-group-btn\"> <button type=\"submit\" class=\"btn btn-default\"> <svg viewbox=\"0 0 32 32\" class=\"icon icon-large icon-search3\"><use xmlns:xlink=\"http://www.w3.org/1999/xlink\" xlink:href=\"#search3\"></use></svg></button> </span></div>\n</div>\n</form>\n<p class=\"push-top\" mce_advimageresize_id=\"Form_EditForm_Content_mce_0\"><strong>Still need help?</strong> <br>Browse our <a href=\"help\">help section</a>, <a href=\"mailto:websupport@crossroads.net\">email us</a> or give us a call at 513‑731‑7400.</p>\n</div>\n<div class=\"col-sm-7 push-top\"><img class=\"img-responsive imgix-fluid full-width\" title=\"404 Page Not Found Crushed Coffee Cup\" data-src=\"//crossroads-media.imgix.net/images/coffee-cup-crushed.jpg\" alt=\"Page not found!\" src=\"http://content.crossroads.net/\" mce_advimageresize_id=\"Form_EditForm_Content_mce_1\"></div>\n</div>",
          "requiresAngular" => "1",
          "title" => "Server error",
          "uRLSegment" => "servererror"}]}


      end

      def fake_server_error_page() do
        %{"pages" => [%{ 
          "content" => "<div class=\"push-top\">\n<div class=\"col-sm-5\">\n<h1 class=\"brand-font type-color page-header\">Oops.</h1>\n<h2 class=\"subheading push-bottom\">We're sorry. There seems to have been an issue.</h2>\n<p>Please use the navigation above or search here.</p>\n<form role=\"form\" action=\"/search\">\n<div class=\"form-group\">\n<div class=\"input-group input-group-lg\" ui-sref=\"search\" ng-click=\"ok($event)\"><input class=\"form-control input-lg\" type=\"search\" placeholder=\"Search\" name=\"q\"><span class=\"input-group-btn\"> <button type=\"submit\" class=\"btn btn-default\"> <svg viewbox=\"0 0 32 32\" class=\"icon icon-large icon-search3\"><use xmlns:xlink=\"http://www.w3.org/1999/xlink\" xlink:href=\"#search3\"></use></svg></button> </span></div>\n</div>\n</form>\n<p class=\"push-top\" mce_advimageresize_id=\"Form_EditForm_Content_mce_0\"><strong>Still need help?</strong> <br>Browse our <a href=\"help\">help section</a>, <a href=\"mailto:websupport@crossroads.net\">email us</a> or give us a call at 513‑731‑7400.</p>\n</div>\n<div class=\"col-sm-7 push-top\"><img class=\"img-responsive imgix-fluid full-width\" title=\"404 Page Not Found Crushed Coffee Cup\" data-src=\"//crossroads-media.imgix.net/images/coffee-cup-crushed.jpg\" alt=\"Page not found!\" src=\"http://content.crossroads.net/\" mce_advimageresize_id=\"Form_EditForm_Content_mce_1\"></div>\n</div>",
          "requiresAngular" => "1", 
          "title" => "Server error",
          "uRLSegment" => "servererror"}]}


      end

      def fake_system_page(stateName) do
        %{"systemPages" => [%{"bodyClasses" => nil,
                                              "card" => "summary",
                                              "className" => "SystemPage",
                                              "created" => "2015-09-24T13:52:49-04:00",
                                              "description" => "We are glad you are here. Let's get your account set up!",
                                              "id" => 59,
                                              "keywords" => nil,
                                              "legacyStyles" => "1",
                                              "stateName" => stateName,
                                              "title" => "Register",
                                              "type" => "website",
                                              "uRL" => "/register"}]}
      end
    end
  end

  setup tags do
    {:ok, conn: Phoenix.ConnTest.build_conn()}
  end
end
