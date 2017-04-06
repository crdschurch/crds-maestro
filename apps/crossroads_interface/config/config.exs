# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

config :crossroads_interface,
  image_url: "#{System.get_env("CRDS_GATEWAY_PROXY")}api/image/profile/",
  cookie_prefix: System.get_env("CRDS_ENV"),
  content_proxy: System.get_env("CRDS_CMS_PROXY"),
  api_url: System.get_env("CRDS_GATEWAY_ENDPOINT")


config :ssl, protocol_version: :"tlsv1.2"

config :crossroads_content,
  http: HTTPoison,
  content_server: System.get_env("CRDS_CMS_ENDPOINT")

# Configures the endpoint
config :crossroads_interface, CrossroadsInterface.Endpoint,
  url: [host: "localhost"],
  root: Path.dirname(__DIR__),
  secret_key_base: "gBPm7fPmEX1U4BGnY+LuZnU576Vb1WWznKt2HDqFF6JQYFXPUOPPDblnHWnMbnf+",
  render_errors: [accepts: ~w(html json)],
  pubsub: [name: CrossroadsInterface.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
