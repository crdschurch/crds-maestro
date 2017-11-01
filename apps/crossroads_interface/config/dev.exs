use Mix.Config

config :crossroads_content,
  cms_server_endpoint: System.get_env("CRDS_CMS_SERVER_ENDPOINT") || "https://contentint.crossroads.net/"

config :fred_content,
  fred_server_endpoint: "http://local.crossroads.net:6060",
  http_cache_ttl: :timer.seconds(60),
  formname_cache_ttl: :timer.seconds(10)

config :crossroads_interface,
  gateway_server_endpoint: System.get_env("CRDS_GATEWAY_SERVER_ENDPOINT") || "https://gatewayint.crossroads.net/gateway/",
  cms_client_endpoint: System.get_env("CRDS_CMS_CLIENT_ENDPOINT") || "https://contentint.crossroads.net/",
  cookie_prefix: System.get_env("CRDS_ENV"),
  cookie_domain: "",
  app_client_endpoint: "/",
  streamspot_id: "crossr30e3",
  streamspot_key: "a0cb38cb-8146-47c2-b11f-6d93f4647389"

config :crossroads_interface, CrossroadsInterface.Endpoint,
  url: [host: "localhost", port: 4000],
  http: [port: 4000],
  debug_errors: false,
  code_reloader: true,
  check_origin: false,
  watchers: [node: ["node_modules/brunch/bin/brunch", "watch", "--stdin"]]

# Watch static and templates for browser reloading.
config :crossroads_interface, CrossroadsInterface.Endpoint,
  live_reload: [
    patterns: [
      ~r{priv/static/js/legacy/.*(js|css|png|jpeg|jpg|gif|svg)$},
      ~r{priv/static/.*(js|css|png|jpeg|jpg|gif|svg)$},
      ~r{priv/gettext/.*(po)$},
      ~r{web/views/.*(ex)$},
      ~r{web/templates/.*(eex)$}
    ]
  ]

# Do not include metadata nor timestamps in development logs
config :logger, :console, format: "[$level] $message\n"

# Set a higher stacktrace during development.
# Do not configure such in production as keeping
# and calculating stacktraces is usually expensive.
config :phoenix, :stacktrace_depth, 20
