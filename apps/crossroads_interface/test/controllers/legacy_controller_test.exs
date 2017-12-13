defmodule CrossroadsInterface.LegacyControllerTest do
  use CrossroadsInterface.ConnCase
  alias CrossroadsContent.CmsClient
  alias CrossroadsContent.Pages
  import Mock

  test "index/2 should return logged out user page when user is not authenticated", %{conn: conn} do
    with_mocks([ {CmsClient, [], [get_content_blocks: fn() -> {:ok, 200, fake_content_blocks()} end]},
                  {CmsClient, [], [get_system_page: fn("") -> {:ok, 200, fake_system_page("")} end]},
                  {Pages, [], [get_page: fn(path, stage) -> CrossroadsContent.FakeHttp.get_page(path, stage) end]},
                  {CrossroadsInterface.CmsPageController, [], [call: fn(conn, _method) -> conn end]},
                  {CrossroadsInterface.Plug.Authorized, [], [call: fn(conn, _) -> assign(conn, :authorized, false) end]},
                  {CrossroadsInterface.CmsPageController, [], [index: fn(conn, _) -> conn end]},
                  {CmsClient, [], [get_site_config: fn(1) -> {:ok, 200, %{}} end]} ]) do
      conn = conn
        |> get("/")

      assert called Pages.get_page("/", false)
      assert conn.assigns[:path] == "/"
      assert conn.assigns[:page] == %{"content" => "<h1>Logged out page</h1>"}
    end
  end

  test "index/2 should return logged in user page when user is authenticated", %{conn: conn} do
    with_mocks([ {CmsClient, [], [get_content_blocks: fn() -> {:ok, 200, fake_content_blocks()} end]},
                  {CmsClient, [], [get_system_page: fn("") -> {:ok, 200, fake_system_page("")} end]},
                  {Pages, [], [get_page: fn(path, stage) -> CrossroadsContent.FakeHttp.get_page(path, stage) end]},
                  {CrossroadsInterface.CmsPageController, [], [call: fn(conn, _method) -> conn end]},
                  {CrossroadsInterface.Plug.Authorized, [], [call: fn(conn, _) -> assign(conn, :authorized, true) end]},
                  {CrossroadsInterface.CmsPageController, [], [index: fn(conn, _) -> conn end]},
                  {CmsClient, [], [get_site_config: fn(1) -> {:ok, 200, %{}} end]} ]) do
      conn = conn
        |> get("/")
      assert called Pages.get_page("/personalized/", false)
      assert conn.assigns[:path] == "/"
      assert conn.assigns[:page] == %{"content" => "<h1>Logged in page</h1>"}
    end
  end

  test "GET CMS page should get page and goto CmsPageController", %{conn: conn} do
    with_mocks([ {CmsClient, [], [get_content_blocks: fn() -> {:ok, 200, fake_content_blocks()} end]},
                  {CmsClient, [], [get_system_page: fn("") -> {:ok, 200, fake_system_page("")} end]},
                  {Pages, [], [get_page: fn(_path, _stage) -> {:ok, %{"content" => "<h1>Page</h1>"}} end]},                  
                  {CrossroadsInterface.CmsPageController, [], [call: fn(conn, _method) -> conn end]},
                  {CrossroadsInterface.CmsPageController, [], [index: fn(conn, _) -> conn end]},
                  {CmsClient, [], [get_site_config: fn(1) -> {:ok, 200, %{}} end]} ]) do
      conn = get conn, "/"
      assert conn.assigns[:path] == "/"
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

  test "GET non CMS page sets redirectUrl", %{conn: conn} do
    with_mocks([ {CmsClient, [], [get_content_blocks: fn() -> {:ok, 200, fake_content_blocks()} end]},
                 {CmsClient, [], [get_system_page: fn("") -> {:ok, 200, fake_system_page("")} end]},
                 {Pages, [], [get_page: fn(_path, _stage) -> :error end]},
                 {CmsClient, [], [get_site_config: fn(1) -> {:ok, 200, %{}} end]} ]) do
      conn = get conn, "/legacypage"
      assert conn.resp_cookies["redirectUrl"].value == "/legacypage"
    end
  end

  test "GET /non-existent is 404 when cookie unmatchedLegacyRoute=/non-existent/", %{conn: conn} do
    with_mocks([ {Pages,     [], [page_exists?: fn(_page) -> false end]},
                 {CmsClient, [], [get_content_blocks: fn() -> {:ok, 200, fake_content_blocks()} end]},
                 {CmsClient, [], [get_system_page: fn("non-existent") -> {:ok, 200, fake_system_page("")} end]},
                 {Pages,     [], [get_page: fn(_path, _stage) -> :error end]},
                 {CmsClient, [], [get_page: fn("/servererror/", false) -> {:ok, 200, fake_error_page()} end]},
                 {CmsClient, [], [get_site_config: fn(1) -> {:ok, 200, %{}} end]} ]) do
      conn = build_conn()
      |> put_req_header("content-type", "text/html")
      |> put_req_cookie("unmatchedLegacyRoute", "/non-existent/")
      |> fetch_cookies()
      |> get("/non-existent")
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

  test "GET /signin does not set redirectUrl", %{conn: conn} do
    with_mocks([ {CmsClient, [], [get_content_blocks: fn() -> {:ok, 200, fake_content_blocks()} end]},
                  {CmsClient, [], [get_system_page: fn("signin") -> {:ok, 200, fake_system_page("signin")} end]},
                  {Pages, [], [get_page: fn(_path, _stage) -> :error end]},
                  {CmsClient, [], [get_site_config: fn(1) -> {:ok, 200, %{}} end]} ]) do
      conn = get conn, "/signin"
      assert !Map.has_key?(conn.resp_cookies, "redirectUrl")
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


