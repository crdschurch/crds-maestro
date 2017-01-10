use Mix.Config


config :crossroads_content,
  http: CrossroadsContent.FakeHttp

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :crossroads_interface, CrossroadsInterface.Endpoint,
  http: [port: 4001],
  server: false

  config :crossroads_interface,
  content_pages: CrossroadsInteface.ContentPagesMock

# Print only warnings and errors during test
config :logger, level: :warn
