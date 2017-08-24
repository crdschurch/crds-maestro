defmodule CrossroadsInterface.StaticController do
  use CrossroadsInterface.Web, :controller
  require Logger
  require File

  @moduledoc"""
  This controller handles static requests
  """
  plug CrossroadsInterface.Plug.ContentBlocks
  plug CrossroadsInterface.Plug.Meta

  def index(conn, _params) do

    Logger.debug "Test:"
    Logger.debug "#{conn.request_path}"

    file = case System.get_env("MAESTRO_RUN_IN_DOCKER") do
      nil -> Path.join(Application.app_dir(:crossroads_interface),"priv/static/js/static#{conn.request_path}/index.html")
      _ -> "/microclients/js/static/explore/index.html"
    end

    html(conn, File.read!(file))
  end

end
