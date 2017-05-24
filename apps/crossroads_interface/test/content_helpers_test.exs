defmodule ContentHelpers.Test do
  use CrossroadsInterface.ConnCase

  test "add_trailing_slash_if_necessary() adds slash if there isn't one'" do
    assert ContentHelpers.add_trailing_slash_if_necessary("/hello") == "/hello/"
  end

  test "add_trailing_slash_if_necessary() doesn't add a slash if there is one" do
    assert ContentHelpers.add_trailing_slash_if_necessary("/hello/") == "/hello/"
  end
end