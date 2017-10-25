use Mix.Config

config :fred_content,
  fred_server_endpoint: "https://embed#{System.get_env("CRDS_ENV")}.crossroads.net/fred",

import_config "#{Mix.env}.exs"
