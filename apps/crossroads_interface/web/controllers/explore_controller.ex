defmodule CrossroadsInterface.ExploreController do
  use CrossroadsInterface.Web, :controller
  require Logger
  require File

  @moduledoc"""
  This controller handles "/explore" requests
  """
  plug CrossroadsInterface.Plug.BaseHref, "/explore"
  plug CrossroadsInterface.Plug.ContentBlocks
  plug CrossroadsInterface.Plug.Meta

  def index(conn, _params) do
    conn
    |> put_headers
    |> render_entry("index.html")
  end

  defp put_headers(conn) do
    conn |> put_resp_header("content-type", "text/html; charset=utf-8")
  end

  defp render_entry(conn, file) do
    path = resolve(file)
    conn |> Plug.Conn.send_file(200, path)
  end

  defp resolve(file) do
    "./priv/static/js/explore/#{file}"
  end

end
