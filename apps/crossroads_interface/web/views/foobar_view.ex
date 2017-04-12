defmodule CrossroadsInterface.FoobarView do
  use CrossroadsInterface.Web, :view


  def cookies(conn, cookie_name) do
    conn.cookies[cookie_name]
  end
end

