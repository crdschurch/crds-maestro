use Mix.Config

config :fred_content,
  fred_server_endpoint: "https://embedint.crossroads.net/fred",
  http_cache_ttl: :timer.seconds(5),
  formname_cache_ttl: :timer.seconds(5)
