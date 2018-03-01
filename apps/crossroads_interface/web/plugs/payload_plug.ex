defmodule CrossroadsInterface.Plug.Payload do
  @moduledoc """
  Assigns the payload from the CMS into the connection
  """
  import Plug.Conn

  def init(default), do: default

  def call(conn, default) when default != nil do
    assign(conn, :payload, default)
  end

  def call(conn, _default) do
    assign(conn, :payload, "")
  end
end
