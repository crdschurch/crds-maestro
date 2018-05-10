use Mix.Config

config :crossroads_interface, CrossroadsInterface.Endpoint,
  http: [port: System.get_env("MAESTRO_PORT"), otp_app: :crossroads_interface],
  url: [host: System.get_env("MAESTRO_HOSTNAME")],
  cache_static_manifest: "priv/static/manifest.json",
  server: true

config :logger,
  backends: [:console, {LoggerFileBackend, :access_log}, {LoggerFileBackend, :error_log}]

config :logger, :access_log,
  path: "/var/log/maestro/maestro-access.log",
  format: "$date $time $metadata[$level] $message\n",
  level: :debug

config :logger, :error_log,
  path: "/var/log/maestro/maestro-error.log",
  format: "$date $time $metadata[$level] $message\n",
  level: :error

config :phoenix, :serve_endpoints, true

config :crossroads_interface, CrossroadsInterface.Endpoint, root: "."