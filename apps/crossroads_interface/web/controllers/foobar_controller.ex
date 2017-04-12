defmodule CrossroadsInterface.FoobarController do
  use CrossroadsInterface.Web, :controller

  alias CrossroadsInterface.Foobar

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
