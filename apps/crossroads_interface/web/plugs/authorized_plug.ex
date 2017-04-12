defmodule CrossroadsInterface.Plug.Authorized do
  import Plug.Conn
  require Logger
  require IEx
  def init(default), do: []

  def call(conn, default) do
    if (conn.cookies["devsessionId"] != nil) do
      Logger.debug("cookie found")
      assign(conn, :authorized, true)
    else 
      assign(conn, :authorized, false)
    end
  end

end
