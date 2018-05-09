defmodule CrossroadsInterface.Plug.FredApiUrl do
  @moduledoc """
  Determine the environment and build the fred API url.
  """
  import Plug.Conn

  def init(_default), do: "https://api-int.crossroads.net"

  def call(conn, default) do
    :crossroads_interface
    |> Application.get_env(:cookie_prefix, "")
    |> case do
      "int" -> assign(conn, :fred_api_url, default)
      "demo" -> assign(conn, :fred_api_url, "https://api-demo.crossroads.net")
      "" -> assign(conn, :fred_api_url, "https://api.crossroads.net")
      _ -> assign(conn, :fred_api_url, default)
    end
  end
end
