use Mix.Config

config :crossroads_content,
  cms_server_endpoint: System.get_env("CRDS_CMS_SERVER_ENDPOINT") || "https://contentint.crossroads.net/",
  publications_server_endpoint: System.get_env("CRDS_PUBLICATIONS_ENDPOINT") || "https://gatewayint.crossroads.net/content/api"
