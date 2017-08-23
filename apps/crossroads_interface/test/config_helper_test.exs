defmodule ConfigHelper.GetSuffixTest do
  use CrossroadsInterface.ConnCase

  test "get_suffix/0 returns empty string when MAESTRO_NAME_EXTENSION and CRDS_ENV are empty", %{conn: _conn} do
    System.put_env("MAESTRO_NAME_EXTENSION", "")
    System.put_env("CRDS_ENV", "")

    assert ConfigHelper.get_suffix() == ""
  end

  test "get_suffix/0 returns _yahoo when MAESTRO_NAME_EXTENSION is _yahoo and CRDS_ENV is empty", %{conn: _conn} do
    System.put_env("MAESTRO_NAME_EXTENSION", "_yahoo")
    System.put_env("CRDS_ENV", "")

    assert ConfigHelper.get_suffix() == "_yahoo"
  end

  test "get_suffix/0 returns -foobar when MAESTRO_NAME_EXTENSION is empty and CRDS_ENV is foobar", %{conn: _conn} do
    System.put_env("MAESTRO_NAME_EXTENSION", "")
    System.put_env("CRDS_ENV", "foobar")

    assert ConfigHelper.get_suffix() == "-foobar"
  end

  test "get_suffix/0 returns _yahoo-foobar when MAESTRO_NAME_EXTENSION is _yahoo and CRDS_ENV is foobar", %{conn: _conn} do
    System.put_env("MAESTRO_NAME_EXTENSION", "_yahoo")
    System.put_env("CRDS_ENV", "foobar")

    assert ConfigHelper.get_suffix() == "_yahoo-foobar"
  end

end
