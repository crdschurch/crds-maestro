defmodule CrossroadsInterface.Plug.Authorized do
  import Plug.Conn

  @env Application.get_env(:crossroads_interface, :cookie_prefix, "")

  def init(default), do: []

  def call(%{req_cookies: %{@env <> "sessionId" => token}} = conn, default) do
    assign(conn, :authorized, is_authorized?(conn, token))
  end
  def call(conn, default) do
    assign(conn, :authorized, false)
  end

  defp is_authorized?(conn, session_cookie) do
    request_path = "api/authenticated"
    headers = [{"Authorization", session_cookie}]
    case CrossroadsInterface.ProxyHttp.gateway_get(request_path, headers) do
      { _, %HTTPoison.Response{ status_code: 200 }} -> true
      _ -> false
    end
  end
end
