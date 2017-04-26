defmodule CrossroadsInterface.AuthorizedPlugTest do
  use CrossroadsInterface.ConnCase
  alias CrossroadsInterface.Plug.Authorized
  import Mock

  test "should return true when a sessionId cookie is present and cookie is still valid", %{conn: conn} do
    Application.put_env(:crossroads_interface, :cookie_prefix, "int")
    with_mock CrossroadsInterface.ProxyHttp, [gateway_get: fn(_url, _headers) -> {:ok, %HTTPoison.Response{body: "", headers: "", status_code: 200}} end] do

     conn = conn
        |> put_req_cookie("intsessionId", "@verySp#C!$lc)0k!e")
        |> fetch_cookies()
        |> Authorized.call([])

      assert conn.assigns.authorized == true
    end
  end

  test "should return false when a sessionId cookie is present, but cookie is invalid", %{conn: conn} do
    Application.put_env(:crossroads_interface, :cookie_prefix, "int")
    with_mock CrossroadsInterface.ProxyHttp, [gateway_get: fn(_url, _headers) -> {:ok, %HTTPoison.Response{body: "", headers: "", status_code: 401}} end] do

      conn = conn
        |> put_req_cookie("intsessionId", "@verySp#C!$lc)0k!e")
        |> fetch_cookies()
        |> Authorized.call([])

      assert conn.assigns.authorized == false
    end
  end

  test "should return false when a sessionId cookie is not present", %{conn: conn} do
    Application.put_env(:crossroads_interface, :cookie_prefix, "int")

    conn = conn
      |> fetch_cookies()
      |> Authorized.call([])

    assert conn.assigns.authorized == false
  end
end

