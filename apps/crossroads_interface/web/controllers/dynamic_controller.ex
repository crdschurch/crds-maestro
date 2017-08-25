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

    file = case System.get_env("MAESTRO_RUN_IN_DOCKER") do
      nil -> Path.join(Application.app_dir(:crossroads_interface),"priv/static/js/static#{conn.request_path}/index.html")
      _ -> "/microclients/js/static#{conn.request_path}/index.html"
    end

    html(conn, File.read!(file))
  end

end
