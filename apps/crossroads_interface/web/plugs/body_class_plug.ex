defmodule CrossroadsInterface.Plug.BodyClass do
  import Plug.Conn
  
  def init(default) do
    default
  end

  def call(conn, [] = default) do
    assign(conn, :body_class, "")
  end

  def call(conn, default) do
    assign(conn, :body_class, default)
  end
end

