defmodule CrossroadsInterface.Plug.Payload do
  import Plug.Conn
  require IEx

  def init(default), do: default

  def call(conn, default) when default != nil do
    assign(conn, :payload, default)
  end

  def call(conn, default) do
    assign(conn, :payload, "")
  end
end
