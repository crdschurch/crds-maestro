defmodule CrossroadsInterface.Plug.Authorized do
  import Plug.Conn
  require Logger
  require IEx
  def init(default), do: []

  def call(conn, default) do
    session_cookie = Application.get_env(:crossroads_interface, :cookie_prefix) <> "sessionId"
    if (conn.req_cookies[session_cookie] != nil) do
      Logger.debug("cookie found")
      assign(conn, :authorized, true)
    else 
      assign(conn, :authorized, false)
    end
  end
end
