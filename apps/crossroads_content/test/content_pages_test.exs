defmodule CrossroadsContentPagesTest do
  use ExUnit.Case, async: false

  alias CrossroadsContent.CmsClient
  alias CrossroadsContent.Pages
  alias CrossroadsContent.FakeHttp

  import Mock
  require IEx

  describe "When using content page caching" do
    setup_with_mocks([
      {CmsClient, [], [get: fn("Page", params) -> FakeHttp.get_pages(params) end]}
    ]) do
      Application.put_env(:crossroads_content, :cms_use_cache, true)
      Pages.start_link([name: CrossroadsContent.Pages])
      :ok
    end

    test "it loads CMS pages on start" do
      # init is called asynchronously, give it a fraction of a sec to process 
      :timer.sleep(10)
      assert called CmsClient.get("Page",%{"requiresAngular" => 0})
    end

    test "get_page(stage=false) returns cached published page" do
      assert {:ok, _} = Pages.get_page("/habitat/") 
    end

    test "get_page(stage=false) returns error if page exists but not cached (published since last cache load)" do
      assert :error = Pages.get_page("/notcached/") 
    end

    test "get_page(stage=false) returns error if not found in cache" do 
      assert :error = Pages.get_page("/gotnothin/")     
    end

    test "get_page(stage=true) returns unpublished page from CMS" do
      assert {:ok, %{"content" => "<h1>Page</h1>"}} = Pages.get_page("/notcached/", true) 
    end

    test "get_page(stage=true) returns unpublished page from CMS even if published version is cached" do
      assert {:ok, %{"content" => "<h1>Page</h1>"}} = Pages.get_page("/habitat/", true) 
    end

    test "get_page(stage=true) returns error if unpublished page that requires angular does not exist" do
      assert :error = Pages.get_page("/gotnothin/", true) 
    end
  
    test "get_page(stage=true) returns error if unknown error occurs getting from CMS" do
      assert :error = Pages.get_page("/error/", true) 
    end
  
    test "get_page_routes() returns list of pages" do
      assert Pages.get_page_routes() == ["/habitat/", "/habitat2/", "/imin/"]
    end
  end
  
  describe "When not using content page caching" do
    setup_with_mocks([
      {CmsClient, [], [get: fn("Page", params) -> FakeHttp.get_pages(params) end]}
    ]) do
      Application.put_env(:crossroads_content, :cms_use_cache, false)
      Pages.start_link([name: CrossroadsContent.Pages])
      :ok
    end

    test "it does not load CMS pages on start" do
      refute called CmsClient.get("Page",%{"requiresAngular" => 0})
    end

    test "get_page(stage=false) returns page from CMS" do
      assert {:ok, _} = Pages.get_page("/habitat/", false)       
    end

    test "get_page(stage=true) returns page from CMS" do
      assert {:ok, _} = Pages.get_page("/habitat/", true)     
    end

    test "get_page() returns error if unknown error occurs getting from CMS" do
      assert :error = Pages.get_page("/error/", true) 
    end
  end

  test "returns empty cache on CMS pages request error" do
    with_mock CmsClient, [get: fn(_url, _params) -> {:error, 500, %{error: "Your stoopid"}} end] do
      Application.put_env(:crossroads_content, :cms_use_cache, true) 
      Pages.start_link([name: CrossroadsContent.Pages])
      assert Pages.get_page_cache() == %{}
    end
  end

  

  



  



  

  

  

end
