use Mix.Config

config :fred_content,
  fred_server_endpoint: System.get_env("CRDS_FRED_ENDPOINT") || "http://local.crossroads.net:6060"
