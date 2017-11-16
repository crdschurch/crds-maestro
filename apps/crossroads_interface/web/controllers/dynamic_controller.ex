defmodule CrossroadsInterface.DynamicController do
  use CrossroadsInterface.Web, :controller
  require Logger
  require File

  @moduledoc"""
  This controller handles requests to the /priv/static/js/static directory
  The request path is appended to the file request and the html is served dynamically
  without further modification to this file. Please adjust router.ex to enable more
  routes to use this.
  """
  plug CrossroadsInterface.Plug.ContentBlocks
  plug CrossroadsInterface.Plug.Meta

  def index(conn, _params) do
    template = "js/static#{conn.request_path}/index.html"
    path = case System.get_env("MAESTRO_RUN_IN_DOCKER") do
      nil -> Path.join(Application.app_dir(:crossroads_interface),"priv/static/#{template}")
      _ -> "/microclients/#{template}"
    end
    html(conn, File.read!(path))
  end

end
