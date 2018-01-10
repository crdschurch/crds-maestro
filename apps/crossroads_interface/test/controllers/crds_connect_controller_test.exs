defmodule CrossroadsInterface.CrdsConnectControllerTest do
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
                                              "stateName" => "connect",
                                              "title" => "Register",
                                              "type" => "website",
                                              "uRL" => "/register"}]}

  test "GET /connect should return 200 status", %{conn: conn} do
    with_mocks([ {Pages, [], [page_exists?: fn(_path) -> false end]},
                 {CmsClient, [], [get_content_blocks: fn() -> {:ok, 200, @content_block_call} end]},
                 {CmsClient, [], [get_system_page: fn("connect") -> {:ok, 200, @system_page_response} end]},
                 {CmsClient, [], [get_site_config: fn(1) -> {:ok, 200, %{}} end]} ]) do
      conn = get conn, "/connect"
      assert html_response(conn, 200)
    end
  end

  test "GET /connect should set redirectUrl cookie", %{conn: conn} do
    with_mocks([ {Pages, [], [page_exists?: fn(_path) -> false end]},
                 {CmsClient, [], [get_content_blocks: fn() -> {:ok, 200, @content_block_call} end]},
                 {CmsClient, [], [get_system_page: fn("connect") -> {:ok, 200, @system_page_response} end]},
                 {CmsClient, [], [get_site_config: fn(1) -> {:ok, 200, %{}} end]} ]) do
      Application.put_env(:crossroads_interface, :cookie_domain, ".crossroads.net")
      conn = get conn, "/connect"
      assert conn.resp_cookies == %{"redirectUrl" => %{http_only: false, value: "/connect", domain: ".crossroads.net"}, "params" => %{domain: ".crossroads.net", http_only: false, value: ""}}
    end
  end
  
end

