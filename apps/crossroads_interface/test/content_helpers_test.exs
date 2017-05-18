defmodule ContentHelpers.Test do
  use CrossroadsInterface.ConnCase

  test "addTrailingSlashIfNecessary() adds slash if there isn't one'" do
    assert ContentHelpers.addTrailingSlashIfNecessary("/hello") == "/hello/"
  end

  test "addTrailingSlashIfNecessary() doesn't add a slash if there is one" do
    assert ContentHelpers.addTrailingSlashIfNecessary("/hello/") == "/hello/"
  end
end