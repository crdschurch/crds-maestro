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
    html(conn, File.read!(Application.app_dir(:crossroads_interface, "priv/static/js/static/explore/index.html")))
  end

end
