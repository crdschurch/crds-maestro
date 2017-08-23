defmodule CrossroadsInterface.Endpoint do
  use Phoenix.Endpoint, otp_app: :crossroads_interface

  socket "/socket", CrossroadsInterface.UserSocket

  application_root_path = Application.app_dir(:crossroads_interface, "priv/static")

  priv_path = case System.get_env("MAESTRO_RUN_IN_DOCKER") do
    nil -> application_root_path
    _ -> "/microclients"
  end
  

  # Serve at "/" the static files from "priv/static" directory.
  #
  # You should set gzip to true if you are running phoenix.digest
  # when deploying your static files in production.

  plug Plug.Static, 
    at: "/", from: application_root_path, gzip: System.get_env("MIX_ENV") == "prod", 
    only_matching: ["css", "fonts", "assets", "images", "js", "favicon", "robots"] 

  plug Plug.Static, 
    at: "/assets", from: Path.join(priv_path, "js/legacy"), gzip: System.get_env("MIX_ENV") == "prod" 
   
  plug Plug.Static, 
    at: "/explore", from: Path.join(priv_path, "js/static/explore"), gzip: System.get_env("MIX_ENV") == "prod", 
    cache_control_for_etags: "public, max-age=86400"

  plug Plug.Static, 
    at: "/", from: Path.join(priv_path, "js/crds_connect"), gzip: System.get_env("MIX_ENV") == "prod", 
    only_matching: ["css", "fonts", "assets", "images", "js", "favicon", "robots"]

  plug CrossroadsInterface.Plug.NotFoundAssetsPlug

  # Code reloading can be explicitly enabled under the
  # :code_reloader configuration of your endpoint.
  if code_reloading? do
    socket "/phoenix/live_reload/socket", Phoenix.LiveReloader.Socket
    plug Phoenix.LiveReloader
    plug Phoenix.CodeReloader
  end

  plug Plug.RequestId
  plug Plug.Logger

  plug Plug.Parsers,
    parsers: [:urlencoded, :multipart, :json],
    pass: ["*/*"],
    json_decoder: Poison

  plug Plug.MethodOverride
  plug Plug.Head

  plug Plug.Session,
    store: :cookie,
    key: "_crossroads_interface_key",
    signing_salt: "f0D768aI"

  plug CrossroadsInterface.Router
end
