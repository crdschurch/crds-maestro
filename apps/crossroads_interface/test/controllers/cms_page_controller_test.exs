defmodule CrossroadsInterface.CmsPageControllerTest do
  use CrossroadsInterface.ConnCase
  alias CrossroadsContent.CmsClient
  alias CrossroadsContent.Pages
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

  test "Getting a page that exists at /habitat/", %{conn: conn} do
    with_mocks([ {CmsClient, [], [get_system_page: fn(page) -> {:ok, 200, fake_system_page(page)} end]},
                 {CmsClient, [], [get_content_blocks: fn() -> {:ok, 200, fake_content_blocks()} end]},
                 {CmsClient, [], [get_site_config: fn(1) -> {:ok, 200, %{}} end]},
                 {Pages, [], [page_exists?: fn(_path) -> true end]},
                 {Pages, [], [get_page: fn(_path) -> @get_page_response end ]},
                 {Pages, [], [get_page: fn(_path, _stage) -> @get_page_response end ]}]) do
      conn = get conn, "/habitat/"
      assert html_response(conn, 200)
      assert called Pages.get_page("/habitat/", false)
    end
  end

  test "Getting a staged page that exists at /habitat/", %{conn: conn} do
    with_mocks([ {CmsClient, [], [get_system_page: fn(page) -> {:ok, 200, fake_system_page(page)} end]},
                 {CmsClient, [], [get_content_blocks: fn() -> {:ok, 200, fake_content_blocks()} end]},
                 {CmsClient, [], [get_site_config: fn(1) -> {:ok, 200, %{}} end]},
                 {Pages, [], [page_exists?: fn(_path) -> true end]},
                 {Pages, [], [get_page: fn(_path) -> @get_page_response end ]},
                 {Pages, [], [get_page: fn(_path, _stage) -> @get_page_response end ]}]) do
      conn = get conn, "/habitat/", %{"stage" => "Stage"}
      assert html_response(conn, 200)
      assert called Pages.get_page("/habitat/", true)
    end
  end

  test "Get should get layout from page", %{conn: conn} do
    with_mocks([ {CmsClient, [], [get_system_page: fn(page) -> {:ok, 200, fake_system_page(page)} end]},
                 {CmsClient, [], [get_content_blocks: fn() -> {:ok, 200, fake_content_blocks()} end]},
                 {CmsClient, [], [get_site_config: fn(1) -> {:ok, 200, %{}} end]},
                 {Pages, [], [page_exists?: fn(_path) -> true end]},
                 {Pages, [], [get_page: fn(_path) -> @get_page_response end ]},
                 {Pages, [], [get_page: fn(_path, _) -> @get_page_response end ]}]) do
      conn = get conn, "/habitat/"
      assert conn.assigns[:layout] =={CrossroadsInterface.LayoutView, "centered_content_page.html"}
    end
  end

  test "Get should get crds styles from page", %{conn: conn} do
      with_mocks([ {CmsClient, [], [get_system_page: fn(page) -> {:ok, 200, fake_system_page(page)} end]},
                 {CmsClient, [], [get_content_blocks: fn() -> {:ok, 200, fake_content_blocks()} end]},
                 {CmsClient, [], [get_site_config: fn(1) -> {:ok, 200, %{}} end]},
                 {Pages, [], [page_exists?: fn(_path) -> true end]},
                 {Pages, [], [get_page: fn(_path) -> @get_page_response end ]},
                 {Pages, [], [get_page: fn(_path, _) -> @get_page_response end ]}]) do
      conn = get conn, "/habitat/"
      assert conn.assigns[:crds_styles] == "crds-legacy-styles"
    end
  end

  test "Get should get body styles from page", %{conn: conn} do
    with_mocks([ {CmsClient, [], [get_system_page: fn(page) -> {:ok, 200, fake_system_page(page)} end]},
                 {CmsClient, [], [get_content_blocks: fn() -> {:ok, 200, fake_content_blocks()} end]},
                 {CmsClient, [], [get_site_config: fn(1) -> {:ok, 200, %{}} end]},
                 {Pages, [], [page_exists?: fn(_path) -> true end]},
                 {Pages, [], [get_page: fn(_path) -> @get_page_response end ]},
                 {Pages, [], [get_page: fn(_path, _) -> @get_page_response end ]}]) do
      conn = get conn, "/habitat/"
      assert conn.assigns[:body_class] == "dad-bod goofy"
    end
  end
  
end
