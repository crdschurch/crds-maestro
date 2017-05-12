defmodule CrossroadsContentPagesTest do
  use ExUnit.Case, async: false

  alias CrossroadsContent.CmsClient
  alias CrossroadsContent.Pages
  alias CrossroadsContent.FakeHttp

  import Mock
  require IEx
  
  test "loads CMS pages on start" do
    with_mock CmsClient, [get_pages: fn(_stage) -> FakeHttp.get_pages() end] do     
      Pages.start_link([name: CrossroadsContent.Pages])
      assert called CmsClient.get_pages(false)
    end
  end

  test "page_exists?() return true if found" do
    with_mock CmsClient, [get_pages: fn(_stage) -> FakeHttp.get_pages() end] do  
      Pages.start_link([name: CrossroadsContent.Pages])     
      assert Pages.page_exists?("/habitat/") 
    end
  end

  test "page_exists?() return false if not found" do
    with_mock CmsClient, [get_pages: fn(_stage) -> FakeHttp.get_pages() end] do  
      Pages.start_link([name: CrossroadsContent.Pages])      
      refute Pages.page_exists?("/gotnothin/") 
    end
  end

  test "get_page() return page if found" do
    with_mock CmsClient, [get_pages: fn(_stage) -> FakeHttp.get_pages() end] do  
      Pages.start_link([name: CrossroadsContent.Pages]) 
      assert {:ok, _} = Pages.get_page("/habitat/") 
    end
  end

  test "get_page() return error if not found" do
    with_mock CmsClient, [get_pages: fn(_stage) -> FakeHttp.get_pages() end] do  
      Pages.start_link([name: CrossroadsContent.Pages])  
      assert :error = Pages.get_page("/gotnothin/")     
    end
  end

end
