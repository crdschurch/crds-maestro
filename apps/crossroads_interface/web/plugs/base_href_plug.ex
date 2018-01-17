defmodule CrossroadsInterface.Plug.BaseHref do
  @moduledoc """
  Sets the base_href in the connection
  """
  import Plug.Conn

  def init(default), do: default

  def call(conn, [] = _default), do: conn

  def call(conn, default) do
    assign(conn, :base_href, default)
  end
end
