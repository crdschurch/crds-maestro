use Mix.Config

config :crossroads_interface, CrossroadsInterface.Endpoint,
  url: [host: {:system, "MAESTRO_HOSTNAME"}, port: {:system, "MAESTRO_PORT"}],
  https: [port: {:system, "MAESTRO_PORT"},
    otp_app: :crossroads_interface,
    keyfile: "/certificates/tls.key",
    certfile: "/certificates/tls.crt"],
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