defmodule CrossroadsInterface.Endpoint do
  use Phoenix.Endpoint, otp_app: :crossroads_interface

  socket "/socket", CrossroadsInterface.UserSocket

  # Serve at "/" the static files from "priv/static" directory.
  #
  # You should set gzip to true if you are running phoenix.digest
  # when deploying your static files in production.
  plug Plug.Static,
    at: "/", from: :crossroads_interface, gzip: System.get_env("MIX_ENV") == "prod",
    only_matching: ["css", "fonts", "assets", "images", "js", "favicon", "robots"]

  plug Plug.Static,
    at: "/assets", from: {:crossroads_interface, "priv/static/js/legacy"}, gzip: System.get_env("MIX_ENV") == "prod"

  plug Plug.Static,
    at: "/", from: {:crossroads_interface, "priv/static/js/crds_connect"}, gzip: System.get_env("MIX_ENV") == "prod",
    only_matching: ["css", "fonts", "assets", "images", "js", "favicon", "robots"]

  # TODO: Both of these approaches seem to work. Need to determine which is best
  # TODO: Determine if this should be done before the other processes above to favor the /microclients folder

  # For Development in Docker look at /microclients folder 
  # if Mix.env == :dev do
  #   plug Plug.Static,
  #     at: "/js/legacy", from: "/microclients/legacy", gzip: System.get_env("MIX_ENV") == "prod"
  # end
  
  if Application.get_env(:crossroads_interface, :run_in_docker) == true do
    plug Plug.Static,
      at: "/js/legacy", from: "/microclients/legacy", gzip: System.get_env("MIX_ENV") == "prod"
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
