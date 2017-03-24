defmodule CrossroadsContentPagesTest do
  use ExUnit.Case, async: true
  doctest CrossroadsContent.Pages

  alias CrossroadsContent.Pages
  alias CrossroadsContent.FakeHttp

  import Mock

  test "get site config returns a 404 response" do
    with_mock HTTPoison, [get: fn(url, _headers, _options) -> FakeHttp.get(url) end] do
      {result, status, _body} = Pages.get_site_config(12)
      assert status == 404
      assert result == :error
    end
  end

  test "get site config returns an error" do
    with_mock HTTPoison, [get: fn(url, _headers, _options) -> FakeHttp.get(url) end] do
      {result, status, _body} = Pages.get_site_config(500)
      assert status == 500
      assert result == :error
    end
  end

  test "get site config returns valid value" do
    with_mock HTTPoison, [get: fn(url, _headers, _options) -> FakeHttp.get(url) end] do
      {result, status, body} = Pages.get_site_config(2)
      assert status == 200
      assert result == :ok
      assert body["siteConfig"]["id"] == 2
    end
  end

  test "get content blocks" do
    with_mock HTTPoison, [get: fn(url,_headers, _options) -> FakeHttp.get(url) end] do
      {result, status, body} = Pages.get_content_blocks
      assert status == 200
      assert result == :ok
      content_blocks = body["contentBlocks"]
      assert Enum.at(content_blocks, 0)["id"] == 1
    end
  end

  test "get systempage for state" do
    with_mock HTTPoison, [get: fn(url, _headers, _options) -> FakeHttp.get(url) end] do
      {result, status, body} = Pages.get_system_page("login")
      assert status == 200
      assert result == :ok
      system_page = body["systemPages"]
      assert Enum.at(system_page, 0)["id"] == 57
    end
  end

  test "get page with stage parameter" do
    with_mock HTTPoison, [get: fn(url, _headers, _options) -> FakeHttp.get(url) end] do
      {result, status, body} = Pages.get_page("/habitat/", true)
      assert status == 200
      assert result == :ok
      page = Enum.at(body["pages"], 0)
      assert page["id"] == 268
    end
  end

  test "get page with no stage parameter" do
    with_mock HTTPoison, [get: fn(url, _headers, _options) -> FakeHttp.get(url) end] do
      {result, status, body} = Pages.get_page("/habitat/", false)
      assert status == 200
      assert result = :ok
      page = Enum.at(body["pages"], 0)
      assert page["id"] == 268
    end
  end
end
