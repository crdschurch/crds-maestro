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
    # TODO: This is an issue running in Maestro

    file = case System.get_env("MAESTRO_RUN_IN_DOCKER") do
      nil -> Application.app_dir(:crossroads_interface, "priv/static/js/static/explore/index.html")
      _ -> "/microclients/static/explore/index.html"
    end

    html(conn, File.read!(file))
  end

end
