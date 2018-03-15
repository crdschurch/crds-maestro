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
  backends: [{LoggerFileBackend, :debug_log}]

config :logger, :debug_log,
  path: "/var/log/maestro/maestro#{ConfigHelper.get_suffix()}.log",
  format: "$date $time $metadata[$level] $message\n",
  level: :debug

config :phoenix, :serve_endpoints, true

config :crossroads_interface, CrossroadsInterface.Endpoint, root: "."