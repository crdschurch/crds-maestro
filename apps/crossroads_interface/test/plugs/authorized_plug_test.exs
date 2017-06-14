defmodule CrossroadsInterface.AuthorizedPlugTest do
  use CrossroadsInterface.ConnCase
  alias CrossroadsInterface.Plug.Authorized
  import Mock

  test "should call the gateway with the cookie value", %{conn: conn} do
    with_mock CrossroadsInterface.ProxyHttp, [gateway_get: fn(_url, _headers) -> {:ok, %HTTPoison.Response{body: "", headers: "", status_code: 200}} end] do
     cookie_value = "@verySp#C!$lc)0k!e"
     conn = conn
        |> put_req_cookie("intsessionId", cookie_value)
        |> fetch_cookies()
        |> Authorized.call([])
      headers = [{"Authorization", cookie_value}]
      assert called CrossroadsInterface.ProxyHttp.gateway_get("api/authenticated", headers)
    end
  end

  test "should return true when a sessionId cookie is present and cookie is still valid", %{conn: conn} do
    with_mock CrossroadsInterface.ProxyHttp, [gateway_get: fn(_url, _headers) -> {:ok, %HTTPoison.Response{body: "", headers: "", status_code: 200}} end] do
     conn = conn
        |> put_req_cookie("intsessionId", "@verySp#C!$lc)0k!e")
        |> fetch_cookies()
        |> Authorized.call([])
      assert conn.assigns.authorized == true
    end
  end

  test "should return false when a sessionId cookie is present, but cookie is invalid", %{conn: conn} do
    with_mock CrossroadsInterface.ProxyHttp, [gateway_get: fn(_url, _headers) -> {:ok, %HTTPoison.Response{body: "", headers: "", status_code: 401}} end] do
      conn = conn
        |> put_req_cookie("intsessionId", "@verySp#C!$lc)0k!e")
        |> fetch_cookies()
        |> Authorized.call([])
      assert conn.assigns.authorized == false
    end
  end

  test "should return false when a sessionId cookie is not present", %{conn: conn} do
    conn = conn
      |> fetch_cookies()
      |> Authorized.call([])
    assert conn.assigns.authorized == false
  end
end

