defmodule CrossroadsInterface.CmsMessageControllerTest do
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
      "onCompleteMessage" => nil, "legacyStyles" => "1", "canEditType" => nil
    }
  }

  @get_message_200_response {:ok, 200,
      %{"message" => %{"className" => "Message", "created" => "2017-11-25T15:12:41-05:00",
          "combinedTags" => [%{"className" => "Tag",
            "created" => "2017-06-04T20:57:40-04:00", "id" => 583,
            "messages" => [3858, 3883], "title" => "ChuckMingo"},
            %{"className" => "Tag", "created" => "2017-11-25T15:12:41-05:00",
            "id" => 702, "messages" => [3883], "series" => [258],
            "title" => "wonder"}],
          "description" => "<p><span id=\"docs-internal-guid-919bed7b-f4d0-3852-0212-a7150bd4eb2e\"><span>There’s something transcendent about Christmas. Even those who don’t have any religious inclinations at all celebrate Christmas.</span></span></p>",
          "date" => "2017-11-25",
          "id" => 3883,
          "title" => "Say No To Good Things for the Sake of Great Things",
          "messageVideo" => %{"className" => "MessageVideo",
            "containsAdultContent" => "0",
            "created" => "2017-06-04T21:13:09-04:00",
            "id" => 6105,
            "serviceId" => "OrUQIiRmH4c",
            "source" => %{"className" => "CloudFile",
              "cloudMetaJson" => "{\"LastPut\":1496863331}",
              "cloudSize" => "1785784520", "cloudStatus" => "Live",
              "content" => nil, "created" => "2017-06-07T15:19:23-04:00",
              "filename" => "https://s3.amazonaws.com/crds-cms-uploads/media/messages/video/060417-v2-1005.mp4",
              "id" => 19727, "name" => "060417-v2-1005.mp4", "owner" => 128,
              "parent" => 827, "showInSearch" => "1",
              "title" => "060417 v2 1005"}, "
            sourcePath" => nil,
            "still" => %{"className" => "CloudImage",
              "cloudMetaJson" => "{\"Dimensions\":\"1920x1080\",\"LastPut\":1496624297}",
              "cloudSize" => "604932", "cloudStatus" => "Live", "content" => nil,
              "created" => "2017-06-04T20:58:16-04:00", "derivedImages" => [4231],
              "filename" => "https://crds-cms-uploads.imgix.net/media/messages/stills/060417-1005.00-52-09-07.Still001.jpg",
              "id" => 19709, "name" => "060417-1005.00-52-09-07.Still001.jpg",
              "owner" => 128, "parent" => 817, "showInSearch" => "1",
              "title" => "060417 1005.00 52 09 07.Still001"}
          },
          "program" => %{"className" => "CloudFile",
            "cloudMetaJson" => "{\"LastPut\":1496624190}",
            "cloudSize" => "751401", "cloudStatus" => "Live", "content" => nil,
            "created" => "2017-06-04T20:56:29-04:00",
            "filename" => "https://s3.amazonaws.com/crds-cms-uploads/media/messages/documents/Week3-FEAR-06-0304-17ProgramLR.pdf",
            "id" => 19708, "name" => "Week3-FEAR-06-0304-17ProgramLR.pdf",
            "owner" => 128, "parent" => 812, "showInSearch" => "1",
            "title" => "Week3 FEAR 06 0304 17ProgramLR"
          },
          "resources" => nil,
        "series" => %{"id" => "258",
          "title" => "Rediscover The Wonder"},
        "messageAudio" => %{"className" => "MessageAudio",
          "containsAdultContent" => "0",
          "created" => "2017-06-04T21:14:17-04:00", "id" => 6106,
          "serviceId" => "fear-is-a-liar-week-3-what-are-you-afraid-of",
          "source" => %{"className" => "CloudFile",
            "cloudMetaJson" => "{\"LastPut\":1496625254}",
            "cloudSize" => "67668375", "cloudStatus" => "Live",
            "content" => nil, "created" => "2017-06-04T21:14:09-04:00",
            "filename" => "https://s3.amazonaws.com/crds-cms-uploads/media/messages/audio/060417-1005.mp3",
            "id" => 19713, "name" => "060417-1005.mp3", "owner" => 128,
            "parent" => 808, "showInSearch" => "1", "title" => "060417 1005"}
        }
      }
    }
  }

  @get_message_404_response {:error, 404, %{"code" => 404, "message" => "Bad juju, Mobear"}}

  test "getting an individual message", %{conn: conn} do
    with_mocks([ {CmsClient, [], [get_system_page: fn(_page) -> {:ok, 200, "foobar"} end]},
                 {CmsClient, [], [get_content_blocks: fn() -> {:ok, 200, %{}} end]},
                 {CmsClient, [], [get_site_config: fn(1) -> {:ok, 200, %{}} end]},
                 {CmsClient, [], [get_message_by_id: fn(_id) -> @get_message_200_response end]},
                 {Pages, [], [page_exists?: fn(_path) -> true end]},
                 {Pages, [], [get_page: fn(_path) -> @get_page_response end ]},
                 {Pages, [], [get_page: fn(_path, _stage) -> @get_page_response end ]}]) do
                    conn = get conn, "/message/3883"
                    assert called CmsClient.get_message_by_id("3883")
                    assert html_response(conn, 200)
                  end
  end

  test "handling when getting a message results in a 404", %{conn: conn} do
    with_mocks([ {CmsClient, [], [get_system_page: fn(_page) -> {:ok, 200, "foobar"} end]},
                 {CmsClient, [], [get_content_blocks: fn() -> {:ok, 200, %{}} end]},
                 {CmsClient, [], [get_site_config: fn(1) -> {:ok, 200, %{}} end]},
                 {CmsClient, [], [get_message_by_id: fn(_id) -> @get_message_404_response end]},
                 {CmsClient, [], [get_page: fn("/servererror/", false) -> {:ok, 200, fake_error_page()} end]},
                 {Pages, [], [page_exists?: fn(_path) -> true end]},
                 {Pages, [], [get_page: fn(_path) -> @get_page_response end ]},
                 {Pages, [], [get_page: fn(_path, _stage) -> @get_page_response end ]}]) do
      conn = get conn, "/message/897547895"
      assert called CmsClient.get_message_by_id("897547895")
      assert html_response(conn, 404)
    end
  end
end
