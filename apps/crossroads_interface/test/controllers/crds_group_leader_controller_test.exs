defmodule CrossroadsInterface.CrdsGroupLeaderControllerTest do
  use CrossroadsInterface.ConnCase
  alias CrossroadsContent.CmsClient
  import Mock

  describe "renders correctly" do
    test "GET /group-leader", %{conn: conn} do
      with_mocks([ {CmsClient, [], [get_content_blocks: fn() -> {:ok, 200, fake_content_blocks()} end]},
                   {CmsClient, [], [get_system_page: fn("group-leader") -> {:ok, 200, fake_system_page("group-leader")} end]},
                   {CmsClient, [], [get_site_config: fn(1) -> {:ok, 200, %{}} end]} ]) do
        conn = get conn, "/group-leader"
        assert html_response(conn, 200)
      end
    end

    test "GET /group-leader displays <app-root>", %{conn: conn} do
      with_mocks([ {CmsClient, [], [get_content_blocks: fn() -> {:ok, 200, fake_content_blocks()} end]},
                   {CmsClient, [], [get_system_page: fn("group-leader") -> {:ok, 200, fake_system_page("group-leader")} end]},
                   {CmsClient, [], [get_site_config: fn(1) -> {:ok, 200, %{}} end]} ]) do
        conn = get conn, "/group-leader"
        assert html_response(conn, 200) =~ "<app-root> Loading... </app-root>"
      end
    end
  end

  test "GET /group-leader sets correct base_href", %{conn: conn} do
    with_mocks([ {CmsClient, [], [get_content_blocks: fn() -> {:ok, 200, fake_content_blocks()} end]},
                 {CmsClient, [], [get_system_page: fn("group-leader") -> {:ok, 200, fake_system_page("group-leader")} end]},
                 {CmsClient, [], [get_site_config: fn(1) -> {:ok, 200, %{}} end]} ]) do
      conn = get conn, "/group-leader"
      assert conn.assigns.base_href == "/group-leader"
    end
  end

  test "GET /group-leader sets correct layout", %{conn: conn} do
    with_mocks([ {CmsClient, [], [get_content_blocks: fn() -> {:ok, 200, fake_content_blocks()} end]},
                 {CmsClient, [], [get_system_page: fn("group-leader") -> {:ok, 200, fake_system_page("group-leader")} end]},
                 {CmsClient, [], [get_site_config: fn(1) -> {:ok, 200, %{}} end]} ]) do
      conn = get conn, "/group-leader"
      assert conn.assigns.layout == {CrossroadsInterface.LayoutView, "no_sidebar.html"}
    end
  end

end
