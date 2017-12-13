defmodule CrossroadsInterface.Plug.Cookie do
  @moduledoc """
  Handles setting the redirect cookie
  """
  import Plug.Conn

  def call(conn, name, value) do
    cookie_options = get_cookie_options()
    conn 
      |> put_resp_cookie(name, URI.encode(value), cookie_options)       
  end

  defp get_cookie_options() do
    cookie_domain = Application.get_env(:crossroads_interface, :cookie_domain)
    case String.length(cookie_domain) do
      0 -> [http_only: false]
      _ -> [http_only: false, domain: cookie_domain]
    end
  end
end
