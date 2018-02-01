defmodule CrossroadsInterface.CmsSeriesControllerTest do
    alias CrossroadsContent.CmsClient
    alias CrossroadsContent.Pages
    use CrossroadsInterface.ConnCase
    import Mock
    
    @get_series_200_response {:ok, 200,
        %{"series" => %{"className" => "Series", "created" => "2017-11-25T15:12:41-05:00",
            "description" => "<div class=\"text-block w-richtext\">\n<p>What's so special about the Christmas season? Let's be honest—it isn't the parties or the presents, and it definitely isn't the egg nog. (Hard pass on any drink with \"egg\" in the title.) It's because of the story. Christmas is the one time each year when our story is guaranteed to collide with God's. In those moments, we need a more transcendent, more fulfilling, and more peaceful life than we imagine. Come join us as we rediscover the wonder that God made us for.</p>\n</div>",
            "endDate" => "2017-12-17",
            "id" => 258, "startDate" => "2017-11-25",
            "image" => %{
              "filename" => "https://crds-cms-uploads.imgix.net/media/messages/stills/WONDER-Series-slide-2.jpg",
            },
            "messages" => [
              %{"date" => "2017-11-25", "id" => 3883,
              "messageVideo" => %{
                "still" => %{
                  "filename" => "https://crds-cms-uploads.imgix.net/media/messages/stills/Screen-Shot-2017-11-25-at-7.56.07-PM.png",
                }
              },
              "title" => "Say No To Good Things for the Sake of Great Things"}
            ],
            "title" => "Rediscover The Wonder", "trailerLink" => nil, "version" => "8"}
          }
        }
  
    @get_series_404_response {:error, 404, %{"code" => 404, "message" => "Bad juju, Mobear"}}
  
    @system_page_response %{"systemPages" => [%{"bodyClasses" => nil,
                                                "card" => "summary",
                                                "className" => "SystemPage",
                                                "created" => "2015-09-24T13:52:49-04:00",
                                                "description" => "We are glad you are here. Let's get your account set up!",
                                                "id" => 59,
                                                "keywords" => nil,
                                                "legacyStyles" => "1",
                                                "stateName" => "register",
                                                "title" => "Register",
                                                "type" => "website",
                                                "uRL" => "/register"}]}
  
    test "getting an individual series", %{conn: conn} do
      with_mocks([ {CmsClient, [], [get_system_page: fn(_page) -> {:ok, 200, @system_page_response} end]},
                   {CmsClient, [], [get_content_blocks: fn() -> {:ok, 200, %{}} end]},
                   {CmsClient, [], [get_site_config: fn(1) -> {:ok, 200, %{}} end]},
                   {CmsClient, [], [get_series_by_id: fn(_id) -> @get_series_200_response end]}]) do
        conn = get conn, "/series/584"
        assert called CmsClient.get_series_by_id("584")
        assert html_response(conn, 200)
      end
    end
  
    test "handling when getting series results in a 404", %{conn: conn} do
      with_mocks([ {CmsClient, [], [get_system_page: fn(_page) -> {:ok, 200, @system_page_response} end]},
                   {CmsClient, [], [get_content_blocks: fn() -> {:ok, 200, %{}} end]},
                   {CmsClient, [], [get_site_config: fn(1) -> {:ok, 200, %{}} end]},
                   {CmsClient, [], [get_series_by_id: fn(_id) -> @get_series_404_response end]},
                   {CmsClient, [], [get_page: fn("/servererror/", false) -> {:ok, 200, fake_error_page()} end]}]) do
        conn = get conn, "/series/897547895"
        assert called CmsClient.get_series_by_id("897547895")
        assert html_response(conn, 404)
      end
    end
  end
  