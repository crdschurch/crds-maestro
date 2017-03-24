use Mix.Config

config :crossroads_content,
  http: HTTPoison,
  content_server: "https://contentint.crossroads.net/"

# For development, we disable any cache and enable
# debugging and code reloading.
#
# The watchers configuration can be used to run external
# watchers to your application. For example, we use it
# with brunch.io to recompile .js and .css sources.
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
