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

  @get_auth_page_response {:ok,
      %{"title" => "Form",
        "canViewType" => "LoggedInUsers",
        "uRLSegment" => "form",
        "id" => 268,
        "content" => "<div class='fred-form' id='formid' redirecturl='https://google.com'></div>",
        "bodyClasses" => "dad-bod,goofy",
        "className" => "CenteredContentPage",
        "pageType" => "CenteredContentPage",
        "link" => "/form/",
        "legacyStyles" => "0",
        "canEditType" => nil}}

  def with_session(conn) do
    session_opts = Plug.Session.init(store: :cookie, key: "_app",
                                      encryption_salt: "abc", signing_salt: "abc")
    conn()
    |> Map.put(:secret_key_base, String.duplicate("abcdefgh", 8))
    |> Plug.Session.call(session_opts)
    |> Plug.Conn.fetch_session()
    |> Plug.Conn.fetch_query_params()
  end

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
      assert conn.assigns[:layout] == {CrossroadsInterface.LayoutView, "centered_content_page.html"}
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
  
  test "Getting LoggedInUsers protected page with redirect if not authorized" do
    with_mocks([ {CmsClient, [], [get_system_page: fn(page) -> {:ok, 200, fake_system_page(page)} end]},
                 {CmsClient, [], [get_content_blocks: fn() -> {:ok, 200, fake_content_blocks()} end]},
                 {CmsClient, [], [get_site_config: fn(1) -> {:ok, 200, %{}} end]},
                 {Pages, [], [page_exists?: fn(_path) -> true end]},
                 {Pages, [], [get_page: fn(_path) -> @get_auth_page_response end ]},
                 {Pages, [], [get_page: fn(_path, _) -> @get_auth_page_response end ]},
                 {CrossroadsInterface.Plug.Authorized, [], [call: fn(conn, _) -> assign(conn, :authorized, false) end]}
              ]) do
      conn = get conn, "/form/"
      assert html_response(conn, 302)
    end
  end

  test "getting authorized cms page should set cookies correctly" do
     with_mocks([
       {CmsClient, [], [get_system_page: fn(page) -> {:ok, 200, fake_system_page(page)} end]},
       {CmsClient, [], [get_content_blocks: fn() -> {:ok, 200, fake_content_blocks()} end]},
       {CmsClient, [], [get_site_config: fn(1) -> {:ok, 200, %{}} end]},
       {Pages, [], [page_exists?: fn(_path) -> true end]},
       {Pages, [], [get_page: fn(_path) -> @get_auth_page_response end ]},
       {Pages, [], [get_page: fn(_path, _) -> @get_auth_page_response end ]},
       {CrossroadsInterface.Plug.Authorized, [], [call: fn(conn, _) -> assign(conn, :authorized, true) end]}
     ]) do
      conn = get conn, "/form/"
      assert conn.resp_cookies["redirectUrl"].value == "content"
      assert conn.resp_cookies["params"].value == "%7B%22link%22:%22/form/%22%7D"
    end
  end

  test "getting authorized cms page when authorized should allow" do
    with_mocks([
      {CmsClient, [], [get_system_page: fn(page) -> {:ok, 200, fake_system_page(page)} end]},
      {CmsClient, [], [get_content_blocks: fn() -> {:ok, 200, fake_content_blocks()} end]},
      {CmsClient, [], [get_site_config: fn(1) -> {:ok, 200, %{}} end]},
      {Pages, [], [page_exists?: fn(_path) -> true end]},
      {Pages, [], [get_page: fn(_path) -> @get_auth_page_response end]},
      {Pages, [], [get_page: fn(_path, _) -> @get_auth_page_response end]},
      {CrossroadsInterface.Plug.Authorized, [], [call: fn(conn, _) -> assign(conn, :authorized, true) end]}
    ]) do
      conn =
        conn
        |> with_session
        |> Map.put(:req_cookies, %{"intsessionId" => "1234"})
        |> get "/form/"
      assert html_response(conn, 200)
    end
  end
end
