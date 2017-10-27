use Mix.Config

config :fred_content,
  fred_server_endpoint: "https://embed#{System.get_env("CRDS_ENV")}.crossroads.net/fred",
  http_cache_ttl: :timer.seconds(60),
  cookie_prefix: System.get_env("CRDS_ENV")

import_config "#{Mix.env}.exs"
