defmodule CrossroadsInterface.CmsSeriesControllerTest do
  alias CrossroadsContent.CmsClient
  alias CrossroadsContent.Pages
  use CrossroadsInterface.ConnCase
  import Mock
  require IEx

  @get_page_response {:ok,
        %{"submitButtonText" => nil, "title" => "Habitat",
        "created" => "2015-08-24T14:06:05-04:00", "canViewType" => nil,
        "inheritSideBar" => "1", "uRLSegment" => "habitat", "id" => 268,
        "hideFieldLabels" => nil, "disableCsrfSecurityToken" => nil,
        "enableLiveValidation" => nil, "sideBar" => 139,
        "disableSaveSubmissions" => nil, "hasBrokenLink" => "0", "type" => "website",
        "content" => "<h1 class=\"page-header\">ReachOut: Habitat</h1><h2 class=\"subheading\">Serving Habitat for Humanity</h
        2><div>\n<p>We believe simple, decent, affordable housing for all people is something God cares about deeply. </p>\n<div>
        \n<p>Our city has one of the lowest home ownership rates in the country. Only 42% of residents in our city own their home
        s, compared to 68% nationally. Statistically speaking, home ownership leads to significant increases in family stability,
        financial security and a sense of belonging to the community. And all of those things increase the likelihood that child
        ren can escape a cycle of poverty.</p>\n</div>\n<p>Check back soon for projects that will be available this spring and su
        mmer. </p>\n</div>",
        "bodyClasses" => "dad-bod,goofy", "menuTitle" => nil, "displayErrorMessagesAtTop" => nil,
        "clearButtonText" => nil, "sort" => "30", "version" => "15",
        "card" => "summary", "metaDescription" => nil, "reportClass" => nil,
        "className" => "CenteredContentPage", "showClearButton" => nil,
        "showInSearch" => "1", "showInMenus" => "1",
        "pageType" => "CenteredContentPage", "extraMeta" => nil,
        "hasBrokenFile" => "0", "metaKeywords" => nil,
        "disableAuthenicatedFinishAction" => nil, "link" => "/habitat/",
        "onCompleteMessage" => nil, "legacyStyles" => "1", "canEditType" => nil}}

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

  test "getting an individual series", %{conn: conn} do
    with_mocks([ {CmsClient, [], [get_system_page: fn(_page) -> {:ok, 200, "foobar"} end]},
                 {CmsClient, [], [get_content_blocks: fn() -> {:ok, 200, %{}} end]},
                 {CmsClient, [], [get_site_config: fn(1) -> {:ok, 200, %{}} end]},
                 {CmsClient, [], [get_series_by_id: fn(_id) -> @get_series_200_response end]},
                 {Pages, [], [page_exists?: fn(_path) -> true end]},
                 {Pages, [], [get_page: fn(_path) -> @get_page_response end ]},
                 {Pages, [], [get_page: fn(_path, _stage) -> @get_page_response end ]}]) do
      conn = get conn, "/series/584"
      assert called CmsClient.get_series_by_id("584")
      assert html_response(conn, 200)
    end
  end

  test "handling when getting series results in a 404", %{conn: conn} do
    with_mocks([ {CmsClient, [], [get_system_page: fn(_page) -> {:ok, 200, "foobar"} end]},
                 {CmsClient, [], [get_content_blocks: fn() -> {:ok, 200, %{}} end]},
                 {CmsClient, [], [get_site_config: fn(1) -> {:ok, 200, %{}} end]},
                 {CmsClient, [], [get_series_by_id: fn(_id) -> @get_series_404_response end]},
                 {CmsClient, [], [get_page: fn("/servererror/", false) -> {:ok, 200, fake_error_page()} end]},
                 {Pages, [], [page_exists?: fn(_path) -> true end]},
                 {Pages, [], [get_page: fn(_path) -> @get_page_response end ]},
                 {Pages, [], [get_page: fn(_path, _stage) -> @get_page_response end ]}]) do
      IEx.pry
      conn = get conn, "/series/897547895"
      assert called CmsClient.get_series_by_id("897547895")
      assert html_response(conn, 404)
    end
  end
end
