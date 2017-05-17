defmodule CrossroadsInterface.Plug.Authorized do
  import Plug.Conn
  require Logger

  def init(default), do: []

  def call(conn, default) do
    session_cookie = Application.get_env(:crossroads_interface, :cookie_prefix) <> "sessionId"
    if (conn.req_cookies[session_cookie] != nil && is_authorized?(conn, conn.req_cookies[session_cookie])) do
      assign(conn, :authorized, true)
    else 
      assign(conn, :authorized, false)
    end
  end

  defp is_authorized?(conn, session_cookie) do
    request_path = "api/authenticated"
    headers = [{"Authorization", session_cookie}]
    {_response_status, response} = CrossroadsInterface.ProxyHttp.gateway_get(request_path, headers)

    case response.status_code do
      200 -> true
      _ -> false
    end
  end
end