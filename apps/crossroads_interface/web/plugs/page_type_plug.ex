defmodule CrossroadsInterface.Plug.PageType do
  import Plug.Conn

  def init(default), do: "no_sidebar.html"

  def call(conn, default) do
    assign(conn, :page_type, default)
  end
end
