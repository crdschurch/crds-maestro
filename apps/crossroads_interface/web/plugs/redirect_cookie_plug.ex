defmodule CrossroadsInterface.Plug.RedirectCookie do
  import Plug.Conn

  def call(conn, url) do
    cookie_options = get_cookie_options()
    conn |> put_resp_cookie("redirectUrl", url, cookie_options)
  end

  def call(conn, url, params) do
    cookie_options = get_cookie_options()
    conn
      |> put_resp_cookie("redirectUrl", URI.encode(url), cookie_options) 
      |> put_resp_cookie("params", URI.encode(params), cookie_options)
  end

  defp get_cookie_options() do
    cookie_domain = Application.get_env(:crossroads_interface, :cookie_domain)
    case String.length(cookie_domain) do
      0 -> [http_only: false]
      _ -> [http_only: false, domain: cookie_domain]
    end
  end
end
