defmodule CrossroadsContentPagesTest do
  use ExUnit.Case, async: false

  alias CrossroadsContent.CmsClient
  alias CrossroadsContent.Pages
  alias CrossroadsContent.FakeHttp

  import Mock
  require IEx
  
  test "loads CMS pages on start" do
    with_mock CmsClient, [get: fn(_url, _params) -> FakeHttp.get_pages() end] do     
      Pages.start_link([name: CrossroadsContent.Pages])
      assert called CmsClient.get("Page",%{"requiresAngular" => 0})
    end
  end

  test "returns empty cache on CMS pages request error" do
    with_mock CmsClient, [get: fn(_url, _params) -> {:error, 500, %{error: "Your stoopid"}} end] do     
      Pages.start_link([name: CrossroadsContent.Pages])
      assert Pages.get_page_cache() == %{}
    end
  end

  test "page_exists?() return true if found" do
    with_mock CmsClient, [get: fn(_url, _params) -> FakeHttp.get_pages() end] do  
      Pages.start_link([name: CrossroadsContent.Pages])     
      assert Pages.page_exists?("/habitat/") 
    end
  end

  test "page_exists?() return false if not found" do
    with_mock CmsClient, [get: fn(_url, _params) -> FakeHttp.get_pages() end] do  
      Pages.start_link([name: CrossroadsContent.Pages])      
      refute Pages.page_exists?("/gotnothin/") 
    end
  end

  test "get_page() returns cached published page (stage=false)" do
    with_mock CmsClient, [get: fn("Page", %{"requiresAngular" => 0}) -> FakeHttp.get_pages() end] do  
      Pages.start_link([name: CrossroadsContent.Pages]) 
      assert {:ok, _} = Pages.get_page("/habitat/") 
    end
  end

  test "get_page() returns page from CMS if not cached (published since last cache load)" do
    with_mock CmsClient, [get: fn("Page", params) -> FakeHttp.get_pages(params) end] do  
      Pages.start_link([name: CrossroadsContent.Pages]) 
      assert {:ok, %{"content" => "<h1>Page</h1>"}} = Pages.get_page("/notcached/") 
    end
  end

  test "get_page() return unpublished (stage=true) page from CMS if not cached" do
    with_mock CmsClient, [get: fn("Page", params) -> FakeHttp.get_pages(params) end] do   
      Pages.start_link([name: CrossroadsContent.Pages]) 
      assert {:ok, %{"content" => "<h1>Page</h1>"}} = Pages.get_page("/notcached/", true) 
    end
  end

  test "get_page() return error if not found" do 
    with_mock CmsClient, [get: fn("Page", params) -> FakeHttp.get_pages(params) end] do 
      Pages.start_link([name: CrossroadsContent.Pages])  
      assert :error = Pages.get_page("/gotnothin/")     
    end
  end

  test "get_page_routes() returns list of pages" do
    with_mock CmsClient, [get: fn(_url, _params) -> FakeHttp.get_pages() end] do  
      Pages.start_link([name: CrossroadsContent.Pages]) 
      assert Pages.get_page_routes() == ["/habitat/"]
    end
  end

  test "does not include pages that require Angular" do
    with_mock CmsClient, [get: fn(_url, _params) -> FakeHttp.get_pages() end] do     
      Pages.start_link([name: CrossroadsContent.Pages])
      refute Pages.page_exists?("/habitat2/")
    end
  end

end
