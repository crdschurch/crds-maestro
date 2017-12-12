defmodule CrossroadsInterface.CookiePlugTest do
  use CrossroadsInterface.ConnCase

  test "it should create a cookie without a domain", %{conn: conn} do
    Application.put_env(:crossroads_interface, :cookie_domain, "")

    conn = conn |> CrossroadsInterface.Plug.Cookie.call("cookie","value")
    assert conn.resp_cookies == %{"cookie" => %{http_only: false, value: "value"}}
  end

  test "it should create a cookie with a domain", %{conn: conn} do
    Application.put_env(:crossroads_interface, :cookie_domain, ".crossroads.net")

    conn = conn |> CrossroadsInterface.Plug.Cookie.call("cookie","value")
    assert conn.resp_cookies == %{"cookie" => %{http_only: false, value: "value", domain: ".crossroads.net"}}
  end

end