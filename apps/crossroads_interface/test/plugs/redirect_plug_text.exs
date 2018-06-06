defmodule CrossroadsInterface.RedirectPlugTest do
  use ExUnit.Case, async: true
  use Plug.Test

  alias CrossroadsInterface.Redirect

  defmodule Router do
    use Phoenix.Router

    get "/foobar", Redirect, to: "/bazshiz"
  end

  test "redirects to 'bazshiz' when a call for 'foobar' is made." do
    conn = call(Router, :get, "/foobar")

    assert conn.status == 302
    assert String.contains?(conn.resp_body, "href=\"/bazshiz\"")
  end

  defp call(router, verb, path) do
    verb
    |> Plug.Test.conn(path)
    |> router.call(router.init([]))
  end
end
