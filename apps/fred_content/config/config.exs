use Mix.Config

config :fred_content,
  fred_server_endpoint: System.get_env("CRDS_FRED_ENDPOINT"),
  http_cache_ttl: :timer.seconds(60),
  cookie_prefix: System.get_env("CRDS_ENV")

import_config "#{Mix.env}.exs"
