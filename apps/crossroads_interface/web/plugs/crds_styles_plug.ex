defmodule CrossroadsInterface.Plug.CrdsStyles do
  @moduledoc """
  Set the crds_styles flag
  """
  import Plug.Conn

  def init(default) do
    default
  end

  def call(conn, [] = _default) do
    assign(conn, :crds_styles, "")
  end

  def call(conn, default) do
    assign(conn, :crds_styles, default)
  end
end

