defmodule CrossroadsInterface.Plug.RedirectCookie do
  import Plug.Conn
  require IEx
  def call(conn, default) do
    cookie_domain = Application.get_env(:crossroads_interface, :cookie_domain)
    cookie_options =
    case String.length(cookie_domain) do
      0 -> [http_only: false]
      _ -> [http_only: false, domain: cookie_domain]
    end
    conn |> put_resp_cookie("redirectUrl", default, cookie_options)
  end
end
