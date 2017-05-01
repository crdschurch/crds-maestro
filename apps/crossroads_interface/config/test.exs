use Mix.Config


config :crossroads_content,
  cms_server_endpoint: ""

config :crossroads_interface,
  gateway_server_endpoint: ""

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :crossroads_interface, CrossroadsInterface.Endpoint,
  http: [port: 4001],
  server: false

# Print only warnings and errors during test
config :logger, level: :warn
