use Mix.Config

config :crossroads_interface,
  image_url: "https://gatewayint.crossroads.net/gateway/api/image/profile/",
  app_url: "https://int.crossroads.net/",
  cookie_prefix: "int"

config :crossroads_content,
  content_server: "https://contentint.crossroads.net/"

config :crossroads_interface, CrossroadsInterface.Endpoint,
  url: [host: "int.crossroads.net", port: 44300],
  http: [port: 8080],
  https: [port: 44300,
    otp_app: :crossroads_interface,
    keyfile: System.get_env("SSL_KEY_PATH"),
    certfile: System.get_env("SSL_CERT_PATH")],
    cacertfile: System.get_env("SSL_INTERMEDIATE_PATH"),
  cache_static_manifest: "priv/static/manifest.json",
  server: true

config :phoenix, :serve_endpoints, true

config :crossroads_interface, CrossroadsInterface.Endpoint, root: "."
