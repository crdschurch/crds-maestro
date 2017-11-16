defmodule CrossroadsInterface.Plug.BaseHref do
  import Plug.Conn
  require IEx
  
  def init(default) do
    default
  end

  def call(conn, [] = default) do
    assign(conn, :base_href, "/")
  end

  def call(conn, default) do
    assign(conn, :base_href, default)
  end
end
