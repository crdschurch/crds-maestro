use Mix.Config

config :crossroads_content,
  cms_server_endpoint: System.get_env("CRDS_CMS_SERVER_ENDPOINT")

config :crossroads_interface, CrossroadsInterface.Endpoint,
  http: [port: 80],
  https: [port: 443,
    otp_app: :crossroads_interface,
    keyfile: "priv/keys/tls.key",
    certfile: "priv/keys/tls.crt"],
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
