defmodule CrossroadsInterface.LegacyControllerTest do
  use CrossroadsInterface.ConnCase
  alias CrossroadsContent.CmsClient
  alias CrossroadsContent.Pages
  import Mock

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

  test "GET CMS page should get page and goto CmsPageController", %{conn: conn} do
    with_mocks([ {CmsClient, [], [get_content_blocks: fn() -> {:ok, 200, fake_content_blocks()} end]},
                  {CmsClient, [], [get_system_page: fn("") -> {:ok, 200, fake_system_page("")} end]},
                  {Pages, [], [get_page: fn(_path, _stage) -> {:ok, %{"content" => "<h1>Page</h1>"}} end]},                  
                  {CrossroadsInterface.CmsPageController, [], [call: fn(conn, _method) -> conn end]},
                  {CrossroadsInterface.CmsPageController, [], [index: fn(conn, _) -> conn end]},
                  {CmsClient, [], [get_site_config: fn(1) -> {:ok, 200, %{}} end]} ]) do
      conn = get conn, "/"
      assert conn.assigns[:page] == %{"content" => "<h1>Page</h1>"}
    end
  end

  test "GET non CMS page ", %{conn: conn} do
    with_mocks([ {CmsClient, [], [get_content_blocks: fn() -> {:ok, 200, fake_content_blocks()} end]},
                 {CmsClient, [], [get_system_page: fn("") -> {:ok, 200, fake_system_page("")} end]},
                 {Pages, [], [get_page: fn(_path, _stage) -> :error end]},
                 {CmsClient, [], [get_site_config: fn(1) -> {:ok, 200, %{}} end]} ]) do
      conn = get conn, "/"
      assert html_response(conn, 200)
    end
  end

  test "GET /non-existant?resolve=true is 404", %{conn: conn} do
    with_mocks([ {Pages,     [], [page_exists?: fn(_page) -> false end]},
                 {CmsClient, [], [get_content_blocks: fn() -> {:ok, 200, fake_content_blocks()} end]},
                 {CmsClient, [], [get_system_page: fn("non-existant") -> {:ok, 200, fake_system_page("")} end]},
                 {Pages,     [], [get_page: fn(_path, _stage) -> :error end]},
                 {CmsClient, [], [get_page: fn("/servererror/", false) -> {:ok, 200, fake_error_page()} end]},
                 {CmsClient, [], [get_site_config: fn(1) -> {:ok, 200, %{}} end]} ]) do
      conn = get(conn, "/non-existant", %{"resolve" => "true"})
      assert html_response(conn, 404)
    end
  end

  test "GET /signin", %{conn: conn} do
    with_mocks([ {CmsClient, [], [get_content_blocks: fn() -> {:ok, 200, fake_content_blocks()} end]},
                  {CmsClient, [], [get_system_page: fn("signin") -> {:ok, 200, fake_system_page("signin")} end]},
                  {Pages, [], [get_page: fn(_path, _stage) -> :error end]},
                  {CmsClient, [], [get_site_config: fn(1) -> {:ok, 200, %{}} end]} ]) do
      conn = get conn, "/signin"
      assert html_response(conn, 200)
    end
  end

  test "GET /signout", %{conn: conn} do
    with_mocks([ {CmsClient, [], [get_content_blocks: fn() -> {:ok, 200, fake_content_blocks()} end]},
                  {CmsClient, [], [get_system_page: fn("signout") -> {:ok, 200, fake_system_page("signout")} end]},
                  {Pages, [], [get_page: fn(_path, _stage) -> :error end]},
                  {CmsClient, [], [get_site_config: fn(1) -> {:ok, 200, %{}} end]} ]) do
      conn = get conn, "/signout"
      assert html_response(conn, 200)
    end
  end
end


