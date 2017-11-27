defmodule CrossroadsInterface.Plug.Authorized do
  @moduledoc """
  Determines if the current user is actually authorized or not
  """
  import Plug.Conn
  alias Mpx.Authentication

  @env Application.get_env(:crossroads_interface, :cookie_prefix, "")

  def init(_default), do: []

  def call(%{req_cookies: %{@env <> "sessionId" => token}} = conn, _default) do
    assign(conn, :authorized, is_authorized?(token))
  end
  def call(conn, _default) do
    assign(conn, :authorized, false)
  end

  defp is_authorized?(session_cookie) do
    Authentication.valid_token?(session_cookie)
  end
end
