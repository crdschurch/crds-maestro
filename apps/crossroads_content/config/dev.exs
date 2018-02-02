use Mix.Config

config :crossroads_content,
  cms_server_endpoint: System.get_env("CRDS_CMS_SERVER_ENDPOINT") || "https://contentint.crossroads.net/",
  content_microservice_endpoint: System.get_env("CRDS_CONTENT_SERVER_ENDPOINT") || "http://local.crossroads.net:5000/"