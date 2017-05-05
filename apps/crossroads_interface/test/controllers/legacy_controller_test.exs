defmodule CrossroadsInterface.LegacyControllerTest do
  use CrossroadsInterface.ConnCase
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

  test "GET /", %{conn: conn} do
    with_mocks([ {Pages, [], [get_content_blocks: fn() -> {:ok, 200, fake_content_blocks()} end]},
                  {Pages, [], [get_system_page: fn(url) -> {:ok, 200, fake_system_page(url)} end]},
                  {Pages, [], [get_site_config: fn(1) -> {:ok, 200, %{}} end]} ]) do
      conn = get conn, "/"
      assert html_response(conn, 200)
    end
  end

  test "GET /non-existant?resolve=true is 404", %{conn: conn} do
    with_mocks([ {Pages, [], [get_content_blocks: fn() -> {:ok, 200, fake_content_blocks()} end]},
                  {Pages, [], [get_system_page: fn("non-existant") -> {:ok, 200, fake_system_page("")} end]},
                  {Pages, [], [get_site_config: fn(1) -> {:ok, 200, %{}} end]} ]) do
      conn = get(conn, "/non-existant", %{"resolve" => "true"})
      assert html_response(conn, 404)
    end
  end

  test "GET /signin", %{conn: conn} do
    with_mocks([ {Pages, [], [get_content_blocks: fn() -> {:ok, 200, fake_content_blocks()} end]},
                  {Pages, [], [get_system_page: fn("signin") -> {:ok, 200, fake_system_page("signin")} end]},
                  {Pages, [], [get_site_config: fn(1) -> {:ok, 200, %{}} end]} ]) do
      conn = get conn, "/signin"
      assert html_response(conn, 200)
    end
  end

  test "GET /signout", %{conn: conn} do
    with_mocks([ {Pages, [], [get_content_blocks: fn() -> {:ok, 200, fake_content_blocks()} end]},
                  {Pages, [], [get_system_page: fn("signout") -> {:ok, 200, fake_system_page("signout")} end]},
                  {Pages, [], [get_site_config: fn(1) -> {:ok, 200, %{}} end]} ]) do
      conn = get conn, "/signout"
      assert html_response(conn, 200)
    end
  end
end


