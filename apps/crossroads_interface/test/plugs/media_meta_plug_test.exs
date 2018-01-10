defmodule CrossroadsInterface.Plugs.MediaMetaTest do
  use CrossroadsInterface.ConnCase
  alias CrossroadsContent.CmsClient
  import Mock

  @series_object %{"description" => "Wizard Cow is a hilariously renamed animal as per the internet", 
                   "image" => %{"filename" => "my_file.jpg"},
                   "title" => "Wizard Cow",
                   "className" => "series",
                   "id" => "222"}

  test "Sets meta data when request to get a server rendered media page occurs", %{conn: conn} do
    with_mock CmsClient, [], [get_site_config: fn(1) -> {:ok, 200, %{}} end] do
      app_env = Application.get_env(:crossroads_interface, :cookie_domain)
      conn = CrossroadsInterface.Plug.MediaMeta.call(conn, @series_object)
  
      assert conn.assigns.meta_title == "Wizard Cow | Crossroads"
      assert conn.assigns.meta_description == "Wizard Cow is a hilariously renamed animal as per the internet"
      assert conn.assigns.meta_url == "https://#{if app_env != "", do: app_env, else: "www"}.crossroads.net/series/222/wizard-cow"
      assert conn.assigns.meta_type == "website"
      assert conn.assigns.meta_image == "my_file.jpg"
    end
  end       
end
  