defmodule CrossroadsInterface.Plug.Authorized do
  import Plug.Conn

  @env Application.get_env(:crossroads_interface, :cookie_prefix, "")

  def init(default), do: []

  def call(%{req_cookies: %{@env <> "sessionId" => token}} = conn, _default) do
    put_authorized(conn, token)
  end
  def call(conn, _default), do: assign(conn, :authorized, false)

  defp put_authorized(conn, session_cookie) do
    request_path = "api/authenticated"
    headers = [{"Authorization", session_cookie}]
    case CrossroadsInterface.ProxyHttp.gateway_get(request_path, headers) do
      {_, %HTTPoison.Response{status_code: 200}} -> assign(conn, :authorized, true)
      _ -> assign(conn, :authorized, false)
    end
  end
end
