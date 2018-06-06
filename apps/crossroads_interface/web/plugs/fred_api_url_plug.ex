defmodule CrossroadsInterface.Plug.FredApiUrl do
  @moduledoc """
  Determine the environment and build the fred API url.
  """
  import Plug.Conn
  require IEx

  def init(default), do: default

  def call(conn, _default) do
    environment = Application.get_env(:crossroads_interface, :cookie_prefix)
    url = case environment do
      "int" -> "https://api-int.crossroads.net"
      "demo" -> "https://api-demo.crossroads.net"
      "" -> "https://api.crossroads.net"
      _ -> "https://api-int.crossroads.net"
    end
    assign(conn, :fred_api_url, url)
  end
end
