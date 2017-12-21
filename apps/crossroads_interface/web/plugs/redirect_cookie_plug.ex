defmodule CrossroadsInterface.Plug.RedirectCookie do
  @moduledoc """
  Handles setting the redirect cookie
  """
  import Plug.Conn

  def call(conn, url) do
    conn |> CrossroadsInterface.Plug.Cookie.call("redirectUrl", url)
  end

  def call(conn, url, params) do    
    conn 
      |> CrossroadsInterface.Plug.Cookie.call("redirectUrl", url)
      |> CrossroadsInterface.Plug.Cookie.call("params", params)
  end

end
