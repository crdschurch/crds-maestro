defmodule CrossroadsInterface.AuthorizedPlugTest do
  use CrossroadsInterface.ConnCase
  alias CrossroadsInterface.Plug.Authorized
  alias Mpx.Authentication
  import Mock

  test "should call the gateway with the cookie value", %{conn: conn} do
    with_mock Authentication, [valid_token?: fn(token) -> true end] do
      cookie_value = "@verySp#C!$lc)0k!e"
      conn
      |> put_req_cookie("intsessionId", cookie_value)
      |> fetch_cookies()
      |> Authorized.call([])
      assert called Authentication.valid_token?(cookie_value)
    end
  end

  test "should return true when a sessionId cookie is present and cookie is still valid", %{conn: conn} do
    with_mock Authentication, [valid_token?: fn(token) -> true end] do
      conn = conn
      |> put_req_cookie("intsessionId", "@verySp#C!$lc)0k!e")
      |> fetch_cookies()
      |> Authorized.call([])
      assert conn.assigns.authorized == true
    end
  end

  test "should return false when a sessionId cookie is present, but cookie is invalid", %{conn: conn} do
    with_mock Authentication, [valid_token?: fn(token) -> false end] do
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

