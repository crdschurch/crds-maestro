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
    application_root_path = Path.join(Application.app_dir(:crossroads_interface), "priv/static")

    priv_path = case System.get_env("MAESTRO_RUN_IN_DOCKER") do
      nil -> application_root_path
      _ -> "/microclients"
    end

    file = Path.join(priv_path, "js/static/explore/index.html")
    html(conn, File.read!(file))
  end

end
