# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
use Mix.Config

config :crossroads_content,
  cms_server_endpoint: System.get_env("CRDS_CMS_SERVER_ENDPOINT")


import_config "#{Mix.env}.exs"
