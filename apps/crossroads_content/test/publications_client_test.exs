defmodule PublicationsTest do
  use ExUnit.Case, async: false

  alias CrossroadsContent.PublicationsClient
  alias CrossroadsContent.FakeHttp

  import Mock
  require IEx

  describe "PublicationsClient " do

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

    @article {:ok,
      %HTTPoison.Response{body: "{\"source\":1,\"id\":\"0001\",\"title\":\"Title 1\",\"body\":\"Body 1\",\"author\":\"Wayne Newton\", \"image\":\"https://cdn.com/jpeg1.jpg\", \"tags\":[\"tag1\", \"tag2\", \"tag3\"]}",
        headers: [{"Date", "Wed, 21 Feb 2018 15:21:26 GMT"},
                  {"Content-Type", "application/json; charset=utf-8"},
                  {"Server", "Kestrel"},
                  {"Transfer-Encoding", "chunked"}],
        request_url: "https://contentservice.crossroads.net/api/content/articles",
        status_code: 200
      }
    }

    setup do
      Application.put_env(:crossroads_content, :cms_use_cache, true)
      PublicationsClient.start_link([name: CrossroadsContent.PublicationsClient])
      :ok
    end

    test "get_articles/0 returns a collection of articles" do
      with_mock HTTPoison, [get: fn(_url, _params) -> @articles end] do

        expected = {:ok, 200, [
          %{"author" => "Wayne Newton", "body" => "Body 1", "id" => "0001",
            "image" => "https://cdn.com/jpeg1.jpg", "source" => 1,
            "tags" => ["tag1", "tag2", "tag3"], "title" => "Title 1"},
          %{"author" => "Dwayne Johnson", "body" => "Body 2", "id" => "0002",
            "image" => "https://cdn.com/jpeg2.jpg", "source" => 2,
            "tags" => ["tag4", "tag5", "tag6"], "title" => "Title 2"}
        ]}
        actual = PublicationsClient.get_articles

        assert expected == actual
      end
    end

    test "get_articles/1 returns an individual article" do
      with_mock HTTPoison, [get: fn(_url, _params) -> @article end] do

        expected = {:ok, 200, [
          %{"author" => "Wayne Newton", "body" => "Body 1", "id" => "0001",
            "image" => "https://cdn.com/jpeg1.jpg", "source" => 1,
            "tags" => ["tag1", "tag2", "tag3"], "title" => "Title 1"
          }
        ]}
        actual = PublicationsClient.get_articles("0001", 1)

        assert expected == actual
      end
    end
  end
end
