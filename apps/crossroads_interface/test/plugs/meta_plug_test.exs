defmodule CrossroadsInterface.Plugs.MetaTest do
  use CrossroadsInterface.ConnCase
  alias CrossroadsContent.CmsClient
  import Mock

  @page_response  %{"submitButtonText" => nil, "title" => "Wizard Cow",
                "created" => "2017-05-17T19:13:05+02:00", "canViewType" => "Inherit",
                "inheritSideBar" => "1",
                "image" => %{"className" => "CloudImage",
                  "cloudMetaJson" => "{\"Dimensions\":\"660x655\",\"LastPut\":1495039552}",
                  "cloudSize" => "175392", "cloudStatus" => "Live", "content" => nil,
                  "created" => "2017-05-17T18:45:51+02:00", "derivedImages" => [25, 27],
                  "filename" => "https://crds-cms-uploads.imgix.net/content/images/animal-wizard-cow.jpg",
                  "id" => 24, "name" => "animal-wizard-cow.jpg", "owner" => 1, "parent" => 8,
                  "showInSearch" => "1", "title" => "animal wizard cow"},
                "uRLSegment" => "wizardcow", "id" => 6, "hideFieldLabels" => "0",
                "disableCsrfSecurityToken" => "0", "enableLiveValidation" => "0",
                "sideBar" => 2, "disableSaveSubmissions" => "0", "hasBrokenLink" => "0",
                "type" => "website", 
                "content" => "<h1 class=\"page-header\">ReachOut: Habitat</h1><h2 class=\"subheading\">Serving Habitat for Humanity</h2>" <>
                  "<div><p>We believe simple, decent, affordable housing for all people is something God cares about deeply. </p><div>" <>
                  "<p>Our city has one of the lowest home ownership rates in the country. Only 42% of residents in our city own their home" <>
                  "s, compared to 68% nationally. Statistically speaking, home ownership leads to significant increases in family stability," <>
                  "financial security and a sense of belonging to the community. And all of those things increase the likelihood that child" <>
                  "ren can escape a cycle of poverty.</p></div><p>Check back soon for projects that will be available this spring and su" <>
                  "mmer. </p></div>", "bodyClasses" => nil,
                "menuTitle" => nil, "displayErrorMessagesAtTop" => "0",
                "clearButtonText" => nil, "sort" => "5", "version" => "7",
                "requiresAngular" => "0",
                "fields" => [%{"buttonText" => nil, "className" => "EditableFormStep",
                    "created" => "2017-05-17T19:17:46+02:00", "customErrorMessage" => nil,
                    "customRules" => nil, "customSettings" => nil, "default" => nil,
                    "description" => nil, "extraClass" => nil, "footer" => nil,
                    "header" => nil, "id" => 1, "label" => nil, "migrated" => "1",
                    "model" => nil, "name" => "EditableFormStep_fc0f4", "parent" => 6,
                    "required" => "0", "rightTitle" => nil, "showOnLoad" => "1",
                    "sort" => "1", "title" => "First Page", "version" => "8"}],
                "card" => "summary", "metaDescription" => "Wizard Cow is a hilariously renamed animal as per the internet", "reportClass" => nil,
                "className" => "CenteredContentPage", "showClearButton" => "0",
                "showInSearch" => "1", "showInMenus" => "1",
                "pageType" => "CenteredContentPage", "extraMeta" => nil,
                "hasBrokenFile" => "0", "metaKeywords" => nil,
                "disableAuthenicatedFinishAction" => "0", "link" => "/wizardcow/",
                "onCompleteMessage" => nil, "legacyStyles" => "1",
                "canEditType" => "Inherit"}

  @page_no_descripton Map.put(@page_response, "metaDescription", nil)

  @page_title_with_site Map.put(@page_response, "title", "Wizard Cow | Crossroads")

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

  @site_config_data %{"siteConfig" => %{"canCreateTopLevelType" => "LoggedInUsers", 
                                        "canEditType" => "LoggedInUsers",
                                        "canViewType" => "Anyone", 
                                        "className" => "SiteConfig",
                                        "created" => "2015-01-21T18:13:55-05:00", 
                                        "facebook" => "crdschurch",
                                        "id" => 1, 
                                        "locale" => "en_US",                                        
                                        "soundCloudURL" => "https://soundcloud.com/crdschurch/",
                                        "tagline" => "Whatever your thoughts on church, whatever your beliefs about God, you are welcome here.",
                                        "theme" => "admin-only", 
                                        "title" => "Crossroads", 
                                        "twitter" => "@crdschurch"}}                                        

  test "Sets meta data when request to a cms page route is made", %{conn: conn} do
    with_mocks([ {CmsClient, [], [get_system_page: fn("register") -> {:ok, 200, @system_page_response} end]},
                 {CmsClient, [], [get_site_config: fn(1) -> {:ok, 200, %{}} end]} ]) do
      conn = %{conn | request_path: "/wizardcow"}
               |> assign(:page, @page_response)
               |> CrossroadsInterface.Plug.Meta.call(%{})
      
      assert conn.assigns.meta_title == "Wizard Cow | Crossroads"
      assert conn.assigns.meta_description == "Wizard Cow is a hilariously renamed animal as per the internet"
      assert conn.assigns.meta_url == "/wizardcow"
      assert conn.assigns.meta_type == "website"
    end
  end     

  test "Sets meta description when metaDescription is not set from content", %{conn: conn} do
    with_mocks([ {CmsClient, [], [get_system_page: fn("register") -> {:ok, 200, @system_page_response} end]},
                 {CmsClient, [], [get_site_config: fn(1) -> {:ok, 200, %{}} end]} ]) do
      conn = %{conn | request_path: "/wizardcow"}
               |> assign(:page, @page_no_descripton)
               |> CrossroadsInterface.Plug.Meta.call(%{})
      
      assert conn.assigns.meta_title == "Wizard Cow | Crossroads"
      assert conn.assigns.meta_description == "ReachOut: HabitatServing Habitat for HumanityWe believe simple, decent, affordable housing for all people is something God cares about deeply. Our city has one of the lowest home ownership rates in the country. Only 42% of residents in our city own their homes, compared to 68% nationally. Statistically "
      assert conn.assigns.meta_url == "/wizardcow"
      assert conn.assigns.meta_type == "website"
    end
  end

  test "Sets title to page_title | site_config_title when metadata contains site title", %{conn: conn} do
    with_mocks([ {CmsClient, [], [get_system_page: fn("register") -> {:ok, 200, @system_page_response} end]},
                 {CmsClient, [], [get_site_config: fn(1) -> {:ok, 200, %{}} end]} ]) do

      conn = %{conn | request_path: "/wizardcow"}
               |> assign(:page, @page_title_with_site)
               |> CrossroadsInterface.Plug.Meta.call(%{})
      
      assert conn.assigns.meta_title == "Wizard Cow | Crossroads"
      assert conn.assigns.meta_description == "Wizard Cow is a hilariously renamed animal as per the internet"
      assert conn.assigns.meta_url == "/wizardcow"
      assert conn.assigns.meta_type == "website"
    end
  end                                       

  test "Sets meta data when request to a system page is made", %{conn: conn} do
    with_mocks([ {CmsClient, [], [get_system_page: fn("register") -> {:ok, 200, @system_page_response} end]},
                 {CmsClient, [], [get_site_config: fn(1) -> {:ok, 200, %{}} end]} ]) do
      conn = %{conn | request_path: "/register"}
               |> CrossroadsInterface.Plug.Meta.call(%{})
      assert conn.assigns.meta_title == "Register | Crossroads"
      assert conn.assigns.meta_description == "We are glad you are here. Let's get your account set up!"
      assert conn.assigns.meta_url == "/register"
      assert conn.assigns.meta_type == "website"
    end
  end

  test "Sets site config data when request to a route is made", %{conn: conn} do
    with_mocks([ {CmsClient, [], [get_system_page: fn("register") -> {:ok, 200, @system_page_response} end]},
                 {CmsClient, [], [get_site_config: fn(1) -> {:ok, 200, @site_config_data} end]} ]) do
      conn = %{conn | request_path: "/register"}
               |> CrossroadsInterface.Plug.Meta.call(%{})
      assert conn.assigns.meta_siteconfig_locale == "en_US"
      assert conn.assigns.meta_siteconfig_facebook == "crdschurch"
      assert conn.assigns.meta_siteconfig_twitter == "@crdschurch"
    end
  end

end
