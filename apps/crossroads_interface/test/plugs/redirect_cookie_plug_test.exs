defmodule CrossroadsInterface.RedirectCookiePlugTest do
  use CrossroadsInterface.ConnCase

  test "it should create a redirectUrl cookie without a domain", %{conn: conn} do
    Application.put_env(:crossroads_interface, :cookie_domain, "")

    conn = conn |> CrossroadsInterface.Plug.RedirectCookie.call("/path")
    assert conn.resp_cookies == %{"redirectUrl" => %{http_only: false, value: "/path"}}
  end

  test "it should create a redirectUrl cookie with a domain", %{conn: conn} do
    Application.put_env(:crossroads_interface, :cookie_domain, ".crossroads.net")

    conn = conn |> CrossroadsInterface.Plug.RedirectCookie.call("/path")
    assert conn.resp_cookies == %{"redirectUrl" => %{http_only: false, value: "/path", domain: ".crossroads.net"}}
  end

  test "it should create a redirectUrl cookie with params", %{conn: conn} do
    Application.put_env(:crossroads_interface, :cookie_domain, "")

    conn = conn |> CrossroadsInterface.Plug.RedirectCookie.call("pathValue", "paramsValue")
    assert conn.resp_cookies == %{"redirectUrl" => %{http_only: false, value: "pathValue"}, "params" => %{http_only: false, value: "paramsValue"}}
  end

end