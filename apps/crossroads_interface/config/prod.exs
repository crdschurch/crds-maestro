use Mix.Config

if "#{System.get_env("MAESTRO_SSL")}" == "true" do
  config :crossroads_interface, CrossroadsInterface.Endpoint,
    http: [port: 80, otp_app: :crossroads_interface],
    https: [port: 443,
      otp_app: :crossroads_interface,
      keyfile: "/certificates/tls.key",
      certfile: "/certificates/tls.crt"]
else
  config :crossroads_interface, CrossroadsInterface.Endpoint,
    http: [port: System.get_env("MAESTRO_PORT"), otp_app: :crossroads_interface]
end

config :crossroads_interface, CrossroadsInterface.Endpoint,
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