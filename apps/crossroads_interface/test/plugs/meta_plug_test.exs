defmodule CrossroadsInterface.Plugs.MetaTest do
  use CrossroadsInterface.ConnCase
  alias CrossroadsContent.CmsClient
  import Mock

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
  @site_config_data %{"siteConfig" => %{"title" => nil,
                                        "locale" => "en_US",
                                        "facebook" => "crdschurch",
                                        "twitter" => "@crdschurch"}}

  test "Sets meta data when request to a route is made", %{conn: conn} do
    with_mocks([
                 {CmsClient, [], [get_system_page: fn("register") -> {:ok, 200, @system_page_response} end]},
                 {CmsClient, [], [get_site_config: fn(1) -> {:ok, 200, %{}} end]} ]) do
      conn = %{conn | request_path: "/register"}
               |> CrossroadsInterface.Plug.Meta.call(%{})
      assert conn.assigns.meta_title == "Register"
      assert conn.assigns.meta_description == "We are glad you are here. Let's get your account set up!"
      assert conn.assigns.meta_url == "/register"
      assert conn.assigns.meta_type == "website"
    end
  end

  test "Sets site config data when request to a route is made", %{conn: conn} do
    with_mocks([
                 {CmsClient, [], [get_system_page: fn("register") -> {:ok, 200, @system_page_response} end]},
                 {CmsClient, [], [get_site_config: fn(1) -> {:ok, 200, @site_config_data} end]} ]) do
      conn = %{conn | request_path: "/register"}
               |> CrossroadsInterface.Plug.Meta.call(%{})
      assert conn.assigns.meta_siteconfig_locale == "en_US"
      assert conn.assigns.meta_siteconfig_facebook == "crdschurch"
      assert conn.assigns.meta_siteconfig_twitter == "@crdschurch"
    end
  end
end
