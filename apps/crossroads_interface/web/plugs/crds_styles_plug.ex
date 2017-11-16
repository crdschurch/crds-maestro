defmodule CrossroadsInterface.Plug.CrdsStyles do
  import Plug.Conn
  
  def init(default) do
    default
  end

  def call(conn, [] = default) do
    assign(conn, :crds_styles, "")
  end

  def call(conn, default) do
    assign(conn, :crds_styles, default)
  end
end

