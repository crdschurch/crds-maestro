defmodule PublicationsTest do
  use ExUnit.Case, async: false

  alias CrossroadsContent.PublicationsClient

  import Mock

  describe "PublicationsClient success paths " do

    @articles {:ok,
      %HTTPoison.Response{
        body: "[{\"source\":1,\"id\":\"0001\",\"title\":\"Title 1\",\"body\":\"Body 1\",\"author\":\"Wayne Newton\",\"publishdate\":\"2018-03-08T00:00:00\",\"image\":\"https://cdn.com/jpeg1.jpg\", \"tags\":[\"tag1\", \"tag2\", \"tag3\"]},{\"source\":2,\"id\":\"0002\",\"title\":\"Title 2\",\"body\":\"Body 2\",\"author\":\"Dwayne Johnson\", \"image\":\"https://cdn.com/jpeg2.jpg\",\"publishdate\":\"2018-03-10T00:00:00\",\"tags\":[\"tag4\", \"tag5\", \"tag6\"]}]",
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
            "tags" => ["tag1", "tag2", "tag3"], "title" => "Title 1",
            "publishdate" => "2018-03-08T00:00:00"},
          %{"author" => "Dwayne Johnson", "body" => "Body 2", "id" => "0002",
            "image" => "https://cdn.com/jpeg2.jpg", "source" => 2,
            "tags" => ["tag4", "tag5", "tag6"], "title" => "Title 2",
            "publishdate" => "2018-03-10T00:00:00"}
        ]}
        actual = PublicationsClient.get_articles

        assert expected == actual
      end
    end

    test "get_article/2 returns an individual article" do
      with_mock HTTPoison, [get: fn(_url, _params) -> @article end] do

        expected = {:ok, 200,
          %{"author" => "Wayne Newton", "body" => "Body 1", "id" => "0001",
            "image" => "https://cdn.com/jpeg1.jpg", "source" => 1,
            "tags" => ["tag1", "tag2", "tag3"], "title" => "Title 1"
          }
        }
        actual = PublicationsClient.get_article("0001", 1)

        assert expected == actual
      end
    end
  end

  describe "PublicationsClient get_articles/0 error paths " do

    setup do
      Application.put_env(:crossroads_content, :cms_use_cache, true)
      PublicationsClient.start_link([name: CrossroadsContent.PublicationsClient])
      :ok
    end

    test "return an empty map on 404" do
      response = {:ok, %HTTPoison.Response{body: "",
        headers: [{"Server", "Kestrel"}, {"X-Powered-By", "ASP.NET"},
                  {"Date", "Tue, 27 Feb 2018 17:16:37 GMT"}, {"Content-Length", "0"}],
        request_url: "https://gatewayint.crossroads.net/content/api/content/helloz",
        status_code: 404}}

      with_mock HTTPoison, [get: fn(_url, _params) -> response end] do
        expected = {:error, 404, %{}}

        actual = PublicationsClient.get_articles()

        assert expected == actual
      end
    end

    test "returns an error reason on 500" do
      response = {:error, %HTTPoison.Error{id: nil, reason: :nxdomain}}

      with_mock HTTPoison, [get: fn(_url, _params) -> response end] do
        expected = {:error, 500, %{error: :nxdomain}}

        actual = PublicationsClient.get_articles()

        assert expected == actual
      end
    end
  end

  describe "PublicationsClient get_article/2 error paths " do

    setup do
      Application.put_env(:crossroads_content, :cms_use_cache, true)
      PublicationsClient.start_link([name: CrossroadsContent.PublicationsClient])
      :ok
    end

    test "return an empty map on 204" do
      response = {:ok, %HTTPoison.Response{body: "",
        headers: [{"Server", "Kestrel"}, {"X-Powered-By", "ASP.NET"},
                  {"Date", "Tue, 27 Feb 2018 17:16:37 GMT"}],
        request_url: "https://gatewayint.crossroads.net/content/api/content/articles/5587664776/2",
        status_code: 204}}

      with_mock HTTPoison, [get: fn(_url, _params) -> response end] do
        expected = {:error, 0, %{error: "unknown response"}}

        actual = PublicationsClient.get_articles()

        assert expected == actual
      end
    end

    test "return an empty map on 404" do
      response = {:ok, %HTTPoison.Response{body: "",
        headers: [{"Server", "Kestrel"}, {"X-Powered-By", "ASP.NET"},
                  {"Date", "Tue, 27 Feb 2018 17:16:37 GMT"}, {"Content-Length", "0"}],
        request_url: "https://gatewayint.crossroads.net/content/api/content/articlez/5587664776/1",
        status_code: 404}}

      with_mock HTTPoison, [get: fn(_url, _params) -> response end] do
        expected = {:error, 404, %{}}

        actual = PublicationsClient.get_articles()

        assert expected == actual
      end
    end

    test "returns an error reason on 500" do
      response = {:error, %HTTPoison.Error{id: nil, reason: :nxdomain}}

      with_mock HTTPoison, [get: fn(_url, _params) -> response end] do
        expected = {:error, 500, %{error: :nxdomain}}

        actual = PublicationsClient.get_articles()

        assert expected == actual
      end
    end
  end

end
