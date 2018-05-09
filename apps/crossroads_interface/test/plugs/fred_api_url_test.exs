defmodule CrossroadsInterface.FredApiUrlPlugTest do
  use CrossroadsInterface.ConnCase

  test "given a blank environment var, the url should point to prod", %{conn: conn} do
    Application.put_env(:crossroads_interface, :cookie_prefix, "")
    conn = CrossroadsInterface.Plug.FredApiUrl.call(conn, "")
    assert conn.assigns[:fred_api_url] == "https://api.crossroads.net"
  end

  test "given an environment var of int, the url should point to int", %{conn: conn} do
    Application.put_env(:crossroads_interface, :cookie_prefix, "int")
    conn = CrossroadsInterface.Plug.FredApiUrl.call(conn, "")
    assert conn.assigns[:fred_api_url] == "https://api-int.crossroads.net"
  end

  test "given an environment var of demo, the url should point to demo", %{conn: conn} do
    Application.put_env(:crossroads_interface, :cookie_prefix, "demo")
    conn = CrossroadsInterface.Plug.FredApiUrl.call(conn, "")
    assert conn.assigns[:fred_api_url] == "https://api-demo.crossroads.net"
  end

  test "given an environment var that is gibberish, the url should point to int", %{conn: conn} do
    Application.put_env(:crossroads_interface, :cookie_prefix, "lsdf")
    conn = CrossroadsInterface.Plug.FredApiUrl.call(conn, "")
    assert conn.assigns[:fred_api_url] == "https://api-int.crossroads.net"
  end
end
