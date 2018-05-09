defmodule CrossroadsInterface.FredApiUrlTest do

  use CrossroadsInterface.ConnCase

  test "given a blank environment var, the url should point to prod", %{conn: conn} do

    Application.put_env(:appname, :cookie_prefix, "") #Set env var that plug uses, this will break if tests run async

    assert CrossroadsInterface.Plug.FredApiUrl.call() == "https://api.crossroads.net"

  end

end