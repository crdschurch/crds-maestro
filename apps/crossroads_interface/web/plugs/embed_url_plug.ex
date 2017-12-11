defmodule CrossroadsInterface.Plug.EmbedUrl do
  @moduledoc """
  Determine the environment and figure out what the embed url is, then set that in the connection.
  """
  import Plug.Conn

  def init(_default), do: "https://embedint.crossroads.net"

  def call(conn, default) do
    :crossroads_interface
    |> Application.get_env(:cookie_prefix, "")
    |> case do
      "int" -> assign(conn, :embed_url, default)
      "demo" -> assign(conn, :embed_url, "https://embeddemo.crossroads.net")
      "" -> assign(conn, :embed_url, "https://embed.crossroads.net")
      _ -> assign(conn, :embed_url, default)
    end
  end
end
