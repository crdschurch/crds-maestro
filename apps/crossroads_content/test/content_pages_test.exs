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

  # test "get site config returns an error" do
  #   with_mock HTTPoison, [get: fn(url, _headers, _options) -> FakeHttp.get(url) end] do
  #     {result, status, _body} = Pages.get_site_config(500)
  #     assert status == 500
  #     assert result == :error
  #   end
  # end

  # test "get site config returns valid value" do
  #   with_mock HTTPoison, [get: fn(url, _headers, _options) -> FakeHttp.get(url) end] do
  #     {result, status, body} = Pages.get_site_config(2)
  #     assert status == 200
  #     assert result == :ok
  #     assert body["siteConfig"]["id"] == 2
  #   end
  # end

  # test "get content blocks" do
  #   with_mock HTTPoison, [get: fn(url,_headers, _options) -> FakeHttp.get(url) end] do
  #     {result, status, body} = Pages.get_content_blocks
  #     assert status == 200
  #     assert result == :ok
  #     content_blocks = body["contentBlocks"]
  #     assert Enum.at(content_blocks, 0)["id"] == 1
  #   end
  # end

  # test "get systempage for state" do
  #   with_mock HTTPoison, [get: fn(url, _headers, _options) -> FakeHttp.get(url) end] do
  #     {result, status, body} = Pages.get_system_page("login")
  #     assert status == 200
  #     assert result == :ok
  #     system_page = body["systemPages"]
  #     assert Enum.at(system_page, 0)["id"] == 57
  #   end
  # end

  # test "get page with stage parameter" do
  #   with_mock HTTPoison, [get: fn(url, _headers, _options) -> FakeHttp.get(url) end] do
  #     {result, status, body} = Pages.get_page("/habitat/", true)
  #     assert status == 200
  #     assert result == :ok
  #     page = Enum.at(body["pages"], 0)
  #     assert page["id"] == 268
  #   end
  # end

  # test "get page with no stage parameter" do
  #   with_mock HTTPoison, [get: fn(url, _headers, _options) -> FakeHttp.get(url) end] do
  #     {result, status, body} = Pages.get_page("/habitat/", false)
  #     assert status == 200
  #     assert result == :ok
  #     page = Enum.at(body["pages"], 0)
  #     assert page["id"] == 268
  #   end
  # end

  # test "get all pages with stage parameter" do
  #   with_mock HTTPoison, [get: fn(url, _headers, _options) -> FakeHttp.get(url) end] do
  #     {result, status, body} = Pages.get_pages(true)
  #     assert status == 200
  #     assert result == :ok
  #     page = Enum.at(body["pages"], 0)
  #     assert page["id"] == 269
  #   end
  # end

  # test "get all pages with no stage parameter" do
  #   with_mock HTTPoison, [get: fn(url, _headers, _options) -> FakeHttp.get(url) end] do
  #     {result, status, body} = Pages.get_pages(false)
  #     assert status == 200
  #     assert result == :ok
  #     page = Enum.at(body["pages"], 0)
  #     assert page["id"] == 270
  #   end
  # end

  # test "it should set cached value on new call" do
  #   with_mock HTTPoison, [get: fn(url,_headers, _options) -> FakeHttp.get(url) end] do      
  #     Pages.get_content_blocks
  #     assert Cachex.exists?(:cms_cache, "ContentBlock")
  #   end
  # end

  # test "it should return cached value when available" do
  #   with_mock HTTPoison, [get: fn(url,_headers, _options) -> FakeHttp.get(url) end] do      
  #     cached_response = {:ok, 200, "cached_body"}
  #     Cachex.set(:cms_cache, "ContentBlock", cached_response)
  #     {result, status, body} = Pages.get_content_blocks
  #     assert result == :ok
  #     assert status == 200
  #     assert body == "cached_body"
  #   end
  # end

  # test "it should not cache an error" do
  #   with_mock HTTPoison, [get: fn(url, _headers, _options) -> FakeHttp.get(url) end] do      
  #     Pages.get_site_config(500)
  #     assert Cachex.empty?(:cms_cache)
  #   end
  # end

end
