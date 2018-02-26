defmodule CrossroadsInterface.PublicationsControllerTest do
  use CrossroadsInterface.ConnCase
  alias CrossroadsContent.CmsClient
  alias CrossroadsContent.PublicationsClient
  import Mock

  @articles [
          %{"author" => "Wayne Newton", "body" => "Body 1", "id" => "0001",
            "image" => "https://cdn.com/jpeg1.jpg", "source" => 1,
            "tags" => ["tag1", "tag2", "tag3"], "title" => "Title 1"},
          %{"author" => "Dwayne Johnson", "body" => "Body 2", "id" => "0002",
            "image" => "https://cdn.com/jpeg2.jpg", "source" => 2,
            "tags" => ["tag4", "tag5", "tag6"], "title" => "Title 2"}
  ]

  @article %{"author" => "Wayne Newton", "body" => "Body 1", "id" => "0001",
            "image" => "https://cdn.com/jpeg1.jpg", "source" => 1,
            "tags" => ["tag1", "tag2", "tag3"], "title" => "Title 1"}

  test "indexArticles/2 responds with all articles", %{conn: conn} do
    with_mocks([ {PublicationsClient, [], [get_articles: fn() -> {:ok, 200, @articles} end]},
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
     id = "0001"
     source = 1
 
     with_mocks([ {PublicationsClient, [], [get_article: fn(_id, _source) -> {:ok, 200, @article} end]},
                  {CmsClient, [], [get_system_page: fn(page) -> {:ok, 200, fake_system_page(page)} end]},
                  {CmsClient, [], [get_content_blocks: fn() -> {:ok, 200, fake_content_blocks()} end]},
                  {CmsClient, [], [get_site_config: fn(1) -> {:ok, 200, %{}} end]} ]) do
 
       params = %{ "source" => source }
 
       response = conn
                  |> get(publications_path(conn, :show_article, id, params))
 
       actual = response.assigns.article
       expected = %{"author" => "Wayne Newton", "body" => "Body 1",
         "id" => "0001", "image" => "https://cdn.com/jpeg1.jpg",
         "source" => 1, "tags" => ["tag1", "tag2", "tag3"],
         "title" => "Title 1"}
 
       assert actual == expected
     end
   end
end
