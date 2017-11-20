defmodule CrossroadsInterface.Plug.PageType do
  @moduledoc """
  Determine the page type from the cms
  """
  import Plug.Conn

  def init(_default), do: "no_sidebar.html"

  def call(conn, default) do
    assign(conn, :page_type, default)
  end
end
