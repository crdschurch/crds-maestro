defmodule CrossroadsInterface.Plug.Authorized do
  @moduledoc """
  Determines if the current user is actually authorized or not
  """
  import Plug.Conn

  @env Application.get_env(:crossroads_interface, :cookie_prefix, "")

  def init(_default), do: []

  def call(%{req_cookies: %{@env <> "sessionId" => token}} = conn, _default) do
    assign(conn, :authorized, is_authorized?(token))
  end
  def call(conn, _default) do
    assign(conn, :authorized, false)
  end

  defp is_authorized?(session_cookie) do
    request_path = "api/authenticated"
    headers = [{"Authorization", session_cookie}]
    case CrossroadsInterface.ProxyHttp.gateway_get(request_path, headers) do
      { _, %HTTPoison.Response{ status_code: 200 }} -> true
      _ -> false
    end
  end
end
