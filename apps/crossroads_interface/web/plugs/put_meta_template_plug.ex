defmodule CrossroadsInterface.Plug.PutMetaTemplate do
  import Plug.Conn
  require IEx
  
  @default_meta_template "meta_tags.html"

  def init(default) do
    default
  end

  def call(conn, [] = default) do
    assign(conn, :meta_template, @default_meta_template)
  end

  def call(conn, default) do
    assign(conn, :meta_template, default)
  end
end
