defmodule CrossroadsInterface.Plug.Redirector do
  use Plug.Redirect

  # Argument #1 is the path to redirect from
  # Argument #2 is the path to redirect to
  redirect "/assets/:anything", "/js/legacy/:anything"

  # An HTTP status code can also be specified
  # redirect "/grace", "/hopper", status: 302

  # # Segements prefixed with a colon will match anything
  # redirect "/blog/:anything", "/blog-closed"

  # # Variable segments can be interpolated into the destination
  # redirect "/users/:name", "/profile/:name"
end