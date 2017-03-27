defmodule CrossroadsInterface.NotfoundControllerTest do
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

  test "GET /notfound", %{conn: conn} do
    with_mocks([ {Pages, [], [get_content_blocks: fn() -> {:ok, 200, @content_block_call} end]},
                 {Pages, [], [get_system_page: fn(_anything) -> {:ok, 200, @system_page_response} end]},
                 {Pages, [], [get_page: fn(_url, _stage) -> {:error, 404, "error"} end ]},
                 {Pages, [], [get_site_config: fn(1) -> {:ok, 200, %{}} end]} ]) do

      conn = get conn, "/notfound"
      assert html_response(conn, 200)
     end
  end

  @tag :skip # not applicable since we mock CMS content
  test "GET /notfound has 404 title", %{conn: conn} do
with_mocks([ {Pages, [], [get_content_blocks: fn() -> {:ok, 200, @content_block_call} end]},
                 {Pages, [], [get_system_page: fn(_anything) -> {:ok, 200, @system_page_response} end]},
                 {Pages, [], [get_page: fn(_url, _stage) -> {:error, 404, "error"} end ]},
                 {Pages, [], [get_site_config: fn(1) -> {:ok, 200, %{}} end]} ]) do

      expectedText = "404 Page Not Found"
      conn = get conn, "/notfound"
      assert html_response(conn, 200) =~ expectedText
    end
  end
  
end
