defmodule CrossroadsInterface.Plugs.CmsPageTest do
    use CrossroadsInterface.ConnCase
    alias CrossroadsContent.Pages
    import Mock
    require IEx
  
    test "given Pages.get_page returns :ok, assigns :page", %{conn: _conn} do
      with_mock Pages, [get_page: fn(_path, _stage) -> {:ok, %{"content" => "<h1>Logged in page</h1>"}} end] do
        conn = build_conn() 
        |> CrossroadsInterface.Plug.CmsPage.call(%{})
        assert conn.assigns[:page] == %{"content" => "<h1>Logged in page</h1>"}
      end
    end
  
    test "given Pages.get_page returns anything other than :ok, does not assign :page", %{conn: _conn} do
      with_mock Pages, [get_page: fn(_path, _stage) -> {:error, ""} end] do
        conn = build_conn() 
        |> CrossroadsInterface.Plug.CmsPage.call(%{})
        assert conn.assigns[:page] == nil
      end
    end
  
  end
