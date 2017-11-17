defmodule CrossroadsInterface.Endpoint do
  use Phoenix.Endpoint, otp_app: :crossroads_interface

  socket "/socket", CrossroadsInterface.UserSocket

  # Serve at "/" the static files from "priv/static" directory.
  #
  # You should set gzip to true if you are running phoenix.digest
  # when deploying your static files in production.

  if System.get_env("MAESTRO_RUN_IN_DOCKER") != nil do

    micro_clients_file_path = "/microclients"
    micro_clients_js_file_path = "#{micro_clients_file_path}/js"
    micro_clients_js_static_file_path = "#{micro_clients_js_file_path}/static"

    plug Plug.Static,
      at: "/", from: micro_clients_file_path, gzip: System.get_env("MIX_ENV") == "prod",
      only_matching: ["css", "fonts", "assets", "images", "js", "favicon", "robots"]

    plug Plug.Static,
      at: "/", from: {:crossroads_interface, "priv/static"}, gzip: System.get_env("MIX_ENV") == "prod",
      only_matching: ["css", "fonts", "assets", "images", "js", "favicon", "robots"]

    plug Plug.Static,
      at: "/explore", from: "#{micro_clients_js_static_file_path}/explore", gzip: System.get_env("MIX_ENV") == "prod",
      cache_control_for_etags: "public, max-age=86400"

    plug Plug.Static,
      at: "/atriumevents", from: "#{micro_clients_js_static_file_path}/atriumevents", gzip: System.get_env("MIX_ENV") == "prod",
      cache_control_for_etags: "public, max-age=86400"

    plug Plug.Static,
      at: "/assets", from: "#{micro_clients_js_file_path}/legacy", gzip: System.get_env("MIX_ENV") == "prod"

    plug Plug.Static,
      at: "/", from: "#{micro_clients_js_file_path}/crds_connect", gzip: System.get_env("MIX_ENV") == "prod",
      only_matching: ["css", "fonts", "assets", "images", "js", "favicon", "robots"]

  else

    file_path = "priv/static"
    js_file_path = "#{file_path}/js"
    js_static_file_path = "#{js_file_path}/static"

    plug Plug.Static,
      at: "/", from: {:crossroads_interface, file_path}, gzip: System.get_env("MIX_ENV") == "prod",
      only_matching: ["css", "fonts", "assets", "images", "js", "favicon", "robots"] ,
      cache_control_for_etags: "public, max-age=86400"

    plug Plug.Static,
      at: "/explore", from: {:crossroads_interface, "#{js_static_file_path}/explore"}, gzip: System.get_env("MIX_ENV") == "prod",
      cache_control_for_etags: "public, max-age=86400"

    plug Plug.Static,
      at: "/atriumevents", from: {:crossroads_interface, "#{js_static_file_path}/atriumevents"}, gzip: System.get_env("MIX_ENV") == "prod",
      cache_control_for_etags: "public, max-age=86400"

    plug Plug.Static,
      at: "/assets", from: {:crossroads_interface, "#{js_file_path}/legacy"}, gzip: System.get_env("MIX_ENV") == "prod"

    plug Plug.Static,
      at: "/", from: {:crossroads_interface, "#{js_file_path}/crds_connect"}, gzip: System.get_env("MIX_ENV") == "prod",
      only_matching: ["css", "fonts", "assets", "images", "js", "favicon", "robots"]

  end

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
