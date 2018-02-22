defmodule CrossroadsInterface.PublicationsControllerTest do
  use CrossroadsInterface.ConnCase
  alias CrossroadsContent.CmsClient
  import Mock
  require IEx

  @articles {:ok,
    %HTTPoison.Response{
      body: "[{\"source\":1,\"id\":\"0001\",\"title\":\"Title 1\",\"body\":\"Body 1\",\"author\":\"Wayne Newton\", \"image\":\"https://cdn.com/jpeg1.jpg\", \"tags\":[\"tag1\", \"tag2\", \"tag3\"]},{\"source\":2,\"id\":\"0002\",\"title\":\"Title 2\",\"body\":\"Body 2\",\"author\":\"Dwayne Johnson\", \"image\":\"https://cdn.com/jpeg2.jpg\", \"tags\":[\"tag4\", \"tag5\", \"tag6\"]}]",
      headers: [{"Date", "Wed, 21 Feb 2018 15:21:26 GMT"},
                {"Content-Type", "application/json; charset=utf-8"},
                {"Server", "Kestrel"},
                {"Transfer-Encoding", "chunked"}],
      request_url: "https://contentservice.crossroads.net/api/content/articles",
      status_code: 200
    }
  }

  test "indexArticles/2 responds with all articles", %{conn: conn} do
    with_mocks([ {HTTPoison, [], [get: fn(_url) -> @articles end]},
                 {CmsClient, [], [get_system_page: fn(page) -> {:ok, 200, fake_system_page(page)} end]},
                 {CmsClient, [], [get_content_blocks: fn() -> {:ok, 200, fake_content_blocks()} end]},
                 {CmsClient, [], [get_site_config: fn(1) -> {:ok, 200, %{}} end]} ]) do

      response = conn
                 |> get(publications_path(conn, :index_articles))


      actual = response.assigns.articles

      # Set expected returned data
      expected = [
        %{"source" => 1, "id" => "0001" , "title" => "Title 1",
          "body" => "Body 1",
          "author" => "Wayne Newton", "image" => "https://cdn.com/jpeg1.jpg",
          "tags" => ["tag1", "tag2", "tag3"]},
        %{"source" => 2, "id" => "0002", "title" => "Title 2",
          "body" => "Body 2",
          "author" => "Dwayne Johnson", "image" => "https://cdn.com/jpeg2.jpg",
          "tags" => ["tag4", "tag5", "tag6"]}
      ]

      # Assert expectation
      assert actual == expected
    end
  end

  test "showArticle/2 responds with an individual article", %{conn: conn} do
    article = {:ok, %HTTPoison.Response{body: "{\"source\":1,\"id\":\"0001\",\"title\":\"Title 1\",\"body\":\"Body 1\",\"author\":\"Wayne Newton\", \"image\":\"https://cdn.com/jpeg1.jpg\", \"tags\":[\"tag1\", \"tag2\", \"tag3\"]}"}}

    with_mocks([ {HTTPoison, [], [get: fn(_url) -> article end]},
                 {CmsClient, [], [get_system_page: fn(page) -> {:ok, 200, fake_system_page(page)} end]},
                 {CmsClient, [], [get_content_blocks: fn() -> {:ok, 200, fake_content_blocks()} end]},
                 {CmsClient, [], [get_site_config: fn(1) -> {:ok, 200, %{}} end]} ]) do

      params = %{ "id" => "0001", "source" => 1 }

      IEx.pry
      response = conn
                 |> get(publications_path(conn, :show_article, "0001", "source": 1))

      actual = response.assigns.article
      expected = %{"author" => "Wayne Newton", "body" => "Body 1",
        "id" => "0001", "image" => "https://cdn.com/jpeg1.jpg",
        "source" => 1, "tags" => ["tag1", "tag2", "tag3"],
        "title" => "Title 1"}

      assert actual == expected
    end
  end
end
