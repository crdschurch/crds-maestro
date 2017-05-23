defmodule CrossroadsContent.FakeHttp do
  @moduledoc """
    A fake implementation of HTTPoison for testing puposes only
  """
  require Logger
  require IEx

  # Mock getting a 404 from the SiteConfig
  def get("/api/SiteConfig/12") do
    {:ok, %HTTPoison.Response{
      body: "{\"code\":404,\"message\":\"Model 12 of SiteConfig not found.\"}",
      headers: [{"Date", "Tue, 27 Dec 2016 14:11:20 GMT"},
        {"Server", "Apache"}, {"Access-Control-Allow-Origin", "*"},
        {"Access-Control-Allow-Headers", ""},
        {"Access-Control-Allow-Methods", "OPTIONS, GET"},
        {"Access-Control-Max-Age", "86400"},
        {"Cache-Control", "max-age=60, must-revalidate, no-transform"},
        {"Pragma", ""},
        {"Vary", "Cookie,X-Forwarded-Protocol,User-Agent,Accept,Accept-Encoding"},
        {"Strict-Transport-Security", "max-age=63072000; preload"},
        {"X-Content-Type-Options", "nosniff"},
        {"Transfer-Encoding", "chunked"},
        {"Content-Type", "application/json; charset=utf-8"}
      ], status_code: 404
    }}
  end

  def get("/api/SiteConfig/500") do
    {:error, %HTTPoison.Error{reason: "Some reason from the server"}}
  end

  def get("/api/SiteConfig/" <> id) do
    {:ok, %HTTPoison.Response{
      body: "{\"siteConfig\":{\"id\":#{id},\"title\":\"Crossroads\",\"tagline\":\"Whatever your thoughts on church, whatever your beliefs about God, you are welcome here.\",\"theme\":\"admin-only\",\"canViewType\":\"Anyone\",\"canEditType\":\"LoggedInUsers\",\"canCreateTopLevelType\":\"LoggedInUsers\",\"soundCloudURL\":\"https:\\/\\/soundcloud.com\\/crdschurch\\/\",\"twitter\":\"@crdschurch\",\"facebook\":\"crdschurch\",\"locale\":\"en_US\",\"rSS_AtomLink_href\":\"http:\\/\\/www.crossroads.net\",\"rSS_Link\":\"http:\\/\\/www.crossroads.net\",\"rSS_Language\":\"en-us\",\"rSS_Copyright\":\"Please redistribute\",\"rSS_iTunesAuthor\":\"Crossroads\",\"rSS_iTunesSummary\":\"Crossroads Church in Cincinnati, Ohio is a community for people who are seeking God - from those who are brand new to the whole \\\"church\\\" thing to committed followers of Jesus.\",\"rSS_Description\":\"Crossroads Church in Cincinnati, Ohio is a community for people who are seeking God - from those who are brand new to the whole \\\"church\\\" thing to committed followers of Jesus.\",\"rSS_iTunesOwnerName\":\"Crossroads\",\"rSS_iTunesOwnerEmail\":\"websitefeedback@crossroads.net\",\"rSS_Atom10Link_href\":\"http:\\/\\/www.w3.org\\/2005\\/Atom\",\"rSS_MediaCopyright\":\"Please redistribute\",\"rSS_MediaKeywords\":\"Crossroads,Cincinnati,church,Tome,Brian,Tome,Chuck,Mingo,Mingo\",\"rSS_MediaCategory\":\"Religion &amp; Spirituality\\/Christianity\",\"rSS_iTunesExplicit\":\"no\",\"rSS_iTunesKeywords\":\"Crossroads,Cincinnati,church,Tome,Brian,Tome,Chuck,Mingo,Mingo\",\"rSS_iTunesSubtitle\":\"Crossroads Church in Cincinnati, Ohio is a community for people who are seeking God - from those who are brand new to the whole \\\"church\\\" thing to committed followers of Jesus.\",\"rSS_iTunesCategory\":\"Religion &amp; Spirituality\",\"rSS_iTunesSubCategory\":\"Christianity\",\"created\":\"2015-01-21T18:13:55-05:00\",\"className\":\"SiteConfig\"}}",
      status_code: 200
    }}
  end

  def get("/api/ContentBlock") do
    {:ok, %HTTPoison.Response{ status_code: 200, body: "{\"contentBlocks\": [{\"id\":1,\"title\":\"generalError\",\"content\":\"<p><strong>Oh no!<\\/strong> Looks like there's and error. Pleas fix and try again.<\\/p>\", \"type\":\"error\",\"category\":\"common\",\"className\":\"ContentBlock\"}]}"}} end

  def get("/api/SystemPage/?StateName=login") do
    {:ok, %HTTPoison.Response{ status_code: 200, body: "{\"systemPages\":[{\"id\":57,\"title\":\"Sign In\",\"uRL\":\"\\/signin\",\"stateName\":\"login\",\"description\":\"Let's get you signed in so you can begin exploring Crossroads.net.\",\"keywords\":null,\"bodyClasses\":null,\"legacyStyles\":\"1\",\"type\":\"website\",\"card\":\"summary\",\"created\":\"2015-09-24T13:52:48-04:00\",\"className\":\"SystemPage\"}]}" }}
  end

  def get("/api/Page/?id=12&state=Stage") do
    {:ok, %HTTPoison.Response{ status_code: 200, body: "{\"pages\":[{\"id\":12,\"pageType\":\"CenteredContentPage\",\"link\":\"\\/habitat\\/\",\"title\":\"Habitat\",\"content\":\"<h1 class=\\\"page-header\\\">ReachOut: Habitat<\\/h1>\"}]}"}}
  end

  def get("/api/Page/?link=/habitat/&stage=Stage") do
    {:ok, %HTTPoison.Response{ status_code: 200, body: "{\"pages\":[{\"id\":268,\"submitButtonText\":null,\"clearButtonText\":null,\"onCompleteMessage\":null,\"showClearButton\":null,\"disableSaveSubmissions\":null,\"enableLiveValidation\":null,\"hideFieldLabels\":null,\"displayErrorMessagesAtTop\":null,\"disableAuthenicatedFinishAction\":null,\"disableCsrfSecurityToken\":null,\"pageType\":\"CenteredContentPage\",\"link\":\"\\/habitat\\/\",\"metaKeywords\":null,\"bodyClasses\":null,\"legacyStyles\":\"1\",\"type\":\"website\",\"card\":\"summary\",\"inheritSideBar\":\"1\",\"uRLSegment\":\"habitat\",\"title\":\"Habitat\",\"menuTitle\":null,\"content\":\"<h1 class=\\\"page-header\\\">ReachOut: Habitat<\\/h1><h2 class=\\\"subheading\\\">Serving Habitat for Humanity<\\/h2><div>\\n<p>We believe simple, decent, affordable housing for all people is something God cares about deeply.\\u00a0<\\/p>\\n<div>\\n<p>Our city has one of the lowest home ownership rates in the country. Only 42% of residents in our city own their homes, compared to 68% nationally. Statistically speaking, home ownership leads to significant increases in family stability, financial security and a sense of belonging to the community. And all of those things increase the likelihood that children can escape a cycle of poverty.<\\/p>\\n<\\/div>\\n<p>Check back soon for projects that will be available this spring and summer.\\u00a0<\\/p>\\n<\\/div>\",\"metaDescription\":null,\"extraMeta\":null,\"showInMenus\":\"1\",\"showInSearch\":\"1\",\"sort\":\"30\",\"hasBrokenFile\":\"0\",\"hasBrokenLink\":\"0\",\"reportClass\":null,\"canViewType\":\"\",\"canEditType\":\"\",\"version\":\"15\",\"sideBar\":139,\"fields\":[{\"id\":362,\"name\":\"EditableFormStep_00e32\",\"title\":\"First Page\",\"default\":null,\"sort\":\"1\",\"required\":\"0\",\"customErrorMessage\":null,\"customRules\":null,\"customSettings\":null,\"migrated\":\"1\",\"extraClass\":null,\"rightTitle\":null,\"showOnLoad\":\"1\",\"model\":null,\"header\":null,\"description\":null,\"label\":null,\"footer\":null,\"buttonText\":null,\"version\":\"3\",\"parent\":268,\"created\":\"2016-09-19T14:03:08-04:00\",\"className\":\"EditableFormStep\"}],\"created\":\"2015-08-24T14:06:05-04:00\",\"className\":\"CenteredContentPage\"}]}"  }}
  end

  def get("/api/Page/?link=/habitat/") do
    {:ok, %HTTPoison.Response{ status_code: 200, body: "{\"pages\":[{\"id\":268,\"submitButtonText\":null,\"clearButtonText\":null,\"onCompleteMessage\":null,\"showClearButton\":null,\"disableSaveSubmissions\":null,\"enableLiveValidation\":null,\"hideFieldLabels\":null,\"displayErrorMessagesAtTop\":null,\"disableAuthenicatedFinishAction\":null,\"disableCsrfSecurityToken\":null,\"pageType\":\"CenteredContentPage\",\"link\":\"\\/habitat\\/\",\"metaKeywords\":null,\"bodyClasses\":null,\"legacyStyles\":\"1\",\"type\":\"website\",\"card\":\"summary\",\"inheritSideBar\":\"1\",\"uRLSegment\":\"habitat\",\"title\":\"Habitat\",\"menuTitle\":null,\"content\":\"<h1 class=\\\"page-header\\\">ReachOut: Habitat<\\/h1><h2 class=\\\"subheading\\\">Serving Habitat for Humanity<\\/h2><div>\\n<p>We believe simple, decent, affordable housing for all people is something God cares about deeply.\\u00a0<\\/p>\\n<div>\\n<p>Our city has one of the lowest home ownership rates in the country. Only 42% of residents in our city own their homes, compared to 68% nationally. Statistically speaking, home ownership leads to significant increases in family stability, financial security and a sense of belonging to the community. And all of those things increase the likelihood that children can escape a cycle of poverty.<\\/p>\\n<\\/div>\\n<p>Check back soon for projects that will be available this spring and summer.\\u00a0<\\/p>\\n<\\/div>\",\"metaDescription\":null,\"extraMeta\":null,\"showInMenus\":\"1\",\"showInSearch\":\"1\",\"sort\":\"30\",\"hasBrokenFile\":\"0\",\"hasBrokenLink\":\"0\",\"reportClass\":null,\"canViewType\":\"\",\"canEditType\":\"\",\"version\":\"15\",\"sideBar\":139,\"fields\":[{\"id\":362,\"name\":\"EditableFormStep_00e32\",\"title\":\"First Page\",\"default\":null,\"sort\":\"1\",\"required\":\"0\",\"customErrorMessage\":null,\"customRules\":null,\"customSettings\":null,\"migrated\":\"1\",\"extraClass\":null,\"rightTitle\":null,\"showOnLoad\":\"1\",\"model\":null,\"header\":null,\"description\":null,\"label\":null,\"footer\":null,\"buttonText\":null,\"version\":\"3\",\"parent\":268,\"created\":\"2016-09-19T14:03:08-04:00\",\"className\":\"EditableFormStep\"}],\"created\":\"2015-08-24T14:06:05-04:00\",\"className\":\"CenteredContentPage\"}]}"  }}
  end

  def get("/api/Page/?stage=Stage") do
    {:ok, %HTTPoison.Response{ status_code: 200, body: "{\"pages\":[{\"id\":269,\"submitButtonText\":null,\"clearButtonText\":null,\"onCompleteMessage\":null,\"showClearButton\":null,\"disableSaveSubmissions\":null,\"enableLiveValidation\":null,\"hideFieldLabels\":null,\"displayErrorMessagesAtTop\":null,\"disableAuthenicatedFinishAction\":null,\"disableCsrfSecurityToken\":null,\"pageType\":\"CenteredContentPage\",\"link\":\"\\/habitat\\/\",\"metaKeywords\":null,\"bodyClasses\":null,\"legacyStyles\":\"1\",\"type\":\"website\",\"card\":\"summary\",\"inheritSideBar\":\"1\",\"uRLSegment\":\"habitat\",\"title\":\"Habitat\",\"menuTitle\":null,\"content\":\"<h1 class=\\\"page-header\\\">ReachOut: Habitat<\\/h1><h2 class=\\\"subheading\\\">Serving Habitat for Humanity<\\/h2><div>\\n<p>We believe simple, decent, affordable housing for all people is something God cares about deeply.\\u00a0<\\/p>\\n<div>\\n<p>Our city has one of the lowest home ownership rates in the country. Only 42% of residents in our city own their homes, compared to 68% nationally. Statistically speaking, home ownership leads to significant increases in family stability, financial security and a sense of belonging to the community. And all of those things increase the likelihood that children can escape a cycle of poverty.<\\/p>\\n<\\/div>\\n<p>Check back soon for projects that will be available this spring and summer.\\u00a0<\\/p>\\n<\\/div>\",\"metaDescription\":null,\"extraMeta\":null,\"showInMenus\":\"1\",\"showInSearch\":\"1\",\"sort\":\"30\",\"hasBrokenFile\":\"0\",\"hasBrokenLink\":\"0\",\"reportClass\":null,\"canViewType\":\"\",\"canEditType\":\"\",\"version\":\"15\",\"sideBar\":139,\"fields\":[{\"id\":362,\"name\":\"EditableFormStep_00e32\",\"title\":\"First Page\",\"default\":null,\"sort\":\"1\",\"required\":\"0\",\"customErrorMessage\":null,\"customRules\":null,\"customSettings\":null,\"migrated\":\"1\",\"extraClass\":null,\"rightTitle\":null,\"showOnLoad\":\"1\",\"model\":null,\"header\":null,\"description\":null,\"label\":null,\"footer\":null,\"buttonText\":null,\"version\":\"3\",\"parent\":268,\"created\":\"2016-09-19T14:03:08-04:00\",\"className\":\"EditableFormStep\"}],\"created\":\"2015-08-24T14:06:05-04:00\",\"className\":\"CenteredContentPage\"}]}"  }}
  end  

  def get("/api/Page") do
    {:ok, %HTTPoison.Response{ status_code: 200, body: "{\"pages\":[{\"id\":270,\"submitButtonText\":null,\"clearButtonText\":null,\"onCompleteMessage\":null,\"showClearButton\":null,\"disableSaveSubmissions\":null,\"enableLiveValidation\":null,\"hideFieldLabels\":null,\"displayErrorMessagesAtTop\":null,\"disableAuthenicatedFinishAction\":null,\"disableCsrfSecurityToken\":null,\"pageType\":\"CenteredContentPage\",\"link\":\"\\/habitat\\/\",\"metaKeywords\":null,\"bodyClasses\":null,\"legacyStyles\":\"1\",\"type\":\"website\",\"card\":\"summary\",\"inheritSideBar\":\"1\",\"uRLSegment\":\"habitat\",\"title\":\"Habitat\",\"menuTitle\":null,\"content\":\"<h1 class=\\\"page-header\\\">ReachOut: Habitat<\\/h1><h2 class=\\\"subheading\\\">Serving Habitat for Humanity<\\/h2><div>\\n<p>We believe simple, decent, affordable housing for all people is something God cares about deeply.\\u00a0<\\/p>\\n<div>\\n<p>Our city has one of the lowest home ownership rates in the country. Only 42% of residents in our city own their homes, compared to 68% nationally. Statistically speaking, home ownership leads to significant increases in family stability, financial security and a sense of belonging to the community. And all of those things increase the likelihood that children can escape a cycle of poverty.<\\/p>\\n<\\/div>\\n<p>Check back soon for projects that will be available this spring and summer.\\u00a0<\\/p>\\n<\\/div>\",\"metaDescription\":null,\"extraMeta\":null,\"showInMenus\":\"1\",\"showInSearch\":\"1\",\"sort\":\"30\",\"hasBrokenFile\":\"0\",\"hasBrokenLink\":\"0\",\"reportClass\":null,\"canViewType\":\"\",\"canEditType\":\"\",\"version\":\"15\",\"sideBar\":139,\"fields\":[{\"id\":362,\"name\":\"EditableFormStep_00e32\",\"title\":\"First Page\",\"default\":null,\"sort\":\"1\",\"required\":\"0\",\"customErrorMessage\":null,\"customRules\":null,\"customSettings\":null,\"migrated\":\"1\",\"extraClass\":null,\"rightTitle\":null,\"showOnLoad\":\"1\",\"model\":null,\"header\":null,\"description\":null,\"label\":null,\"footer\":null,\"buttonText\":null,\"version\":\"3\",\"parent\":268,\"created\":\"2016-09-19T14:03:08-04:00\",\"className\":\"EditableFormStep\"}],\"created\":\"2015-08-24T14:06:05-04:00\",\"className\":\"CenteredContentPage\"}]}"  }}
  end

  def get_pages() do
    {:ok, 200, %{"pages" => [%{"submitButtonText" => nil, "title" => "Habitat",
      "created" => "2015-08-24T14:06:05-04:00", "canViewType" => nil,
      "inheritSideBar" => "1", "uRLSegment" => "habitat", "id" => 268,
      "hideFieldLabels" => nil, "disableCsrfSecurityToken" => nil,
      "enableLiveValidation" => nil, "sideBar" => 139,
      "disableSaveSubmissions" => nil, "hasBrokenLink" => "0",
      "type" => "website",
      "content" => "<h1 class=\"page-header\">ReachOut: Habitat</h1><h2 class=\"subheading\">Serving Habitat for Humanity</h2><div>\n<p>We believe simple, decent, affordable housing for all people is something God cares about deeply. </p>\n<div>\n<p>Our city has one of the lowest home ownership rates in the country. Only 42% of residents in our city own their homes, compared to 68% nationally. Statistically speaking, home ownership leads to significant increases in family stability, financial security and a sense of belonging to the community. And all of those things increase the likelihood that children can escape a cycle of poverty.</p>\n</div>\n<p>Check back soon for projects that will be available this spring and summer. </p>\n</div>",
      "bodyClasses" => nil, "menuTitle" => nil,
      "displayErrorMessagesAtTop" => nil, "clearButtonText" => nil,
      "sort" => "30", "version" => "15", "card" => "summary",
      "metaDescription" => nil, "reportClass" => nil,
      "className" => "CenteredContentPage", "showClearButton" => nil,
      "showInSearch" => "1", "showInMenus" => "1",
      "pageType" => "CenteredContentPage", "extraMeta" => nil,
      "hasBrokenFile" => "0", "metaKeywords" => nil,
      "disableAuthenicatedFinishAction" => nil, "link" => "/habitat/",
      "onCompleteMessage" => nil, "legacyStyles" => "1", "requiresAngular" => "0",
      "canEditType" => nil},
      %{"submitButtonText" => nil, "title" => "Habitat2",
      "created" => "2015-08-24T14:06:05-04:00", "canViewType" => nil,
      "inheritSideBar" => "1", "uRLSegment" => "habitat2", "id" => 268,
      "hideFieldLabels" => nil, "disableCsrfSecurityToken" => nil,
      "enableLiveValidation" => nil, "sideBar" => 139,
      "disableSaveSubmissions" => nil, "hasBrokenLink" => "0",
      "type" => "website",
      "content" => "<h1 class=\"page-header\">ReachOut: Habitat</h1><h2 class=\"subheading\">Serving Habitat for Humanity</h2><div>\n<p>We believe simple, decent, affordable housing for all people is something God cares about deeply. </p>\n<div>\n<p>Our city has one of the lowest home ownership rates in the country. Only 42% of residents in our city own their homes, compared to 68% nationally. Statistically speaking, home ownership leads to significant increases in family stability, financial security and a sense of belonging to the community. And all of those things increase the likelihood that children can escape a cycle of poverty.</p>\n</div>\n<p>Check back soon for projects that will be available this spring and summer. </p>\n</div>",
      "bodyClasses" => nil, "menuTitle" => nil,
      "displayErrorMessagesAtTop" => nil, "clearButtonText" => nil,
      "sort" => "30", "version" => "15", "card" => "summary",
      "metaDescription" => nil, "reportClass" => nil,
      "className" => "CenteredContentPage", "showClearButton" => nil,
      "showInSearch" => "1", "showInMenus" => "1",
      "pageType" => "CenteredContentPage", "extraMeta" => nil,
      "hasBrokenFile" => "0", "metaKeywords" => nil,
      "disableAuthenicatedFinishAction" => nil, "link" => "/habitat2/",
      "onCompleteMessage" => nil, "legacyStyles" => "1", "requiresAngular" => "1",
      "canEditType" => nil}
      ]}}
  end

  def get(url) do
    Logger.debug("getting url... #{url}")
  end

end
