defmodule CrossroadsInterface.ProxyContentControllerTest do
  use CrossroadsInterface.ConnCase
  alias CrossroadsContent.Pages
  import Mock

  @valid %{"pages" => [%{"id" => 239, "link" => "\/some-real-page\/"}]}
  @invalid %{"error" => "nothing there"}

  @valid_content_blocks %{"contentBlocks" => [%{"id" => 1, "title" => "generalError"}]}

  test "request a page that exists at /proxy/content//api/Pages?link=/some-real-page/", %{conn: conn} do
    with_mock Pages, [get_page: fn(_page, _show_stage) -> {:ok, 200, @valid } end] do
      conn = get conn, "/proxy/content//api/Pages?link=/some-real-page/"
      assert json_response(conn, 200) == @valid
      assert called Pages.get_page("/some-real-page/", false)
    end
  end

  test "request a page that doesn't exist /proxy/content//api/Pages?link=/nope/", %{conn: conn} do
    with_mock Pages, [get_page: fn(_page, _show_stage) -> {:error, 500, @invalid } end] do
      conn = get conn, "/proxy/content//api/Pages?link=/nope/"
      assert json_response(conn, 500) == @invalid
      assert called Pages.get_page("/nope/", false)
    end
  end

  test "request content blocks and get 200", %{conn: conn} do
    with_mock Pages, [get_content_blocks: fn() -> {:ok, 200, @valid_content_blocks} end] do
      conn = get conn, "/proxy/content//api/ContentBlock"
      assert json_response(conn, 200) == @valid_content_blocks
      assert called Pages.get_content_blocks()
    end
  end
end
