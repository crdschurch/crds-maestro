# Crossroads Interface - Elixir Phoenix Basics

The [Elixir Phoenix framework](http://phoenixframework.org/), with which Maestro
is built, follows an MVC pattern similar to ASP.NET MVC, Ruby on Rails, etc.
Maestro only utilizes the V(iew) and the C(ontroller) aspects of the Phoenix
framework. This particular guide is meant to introduce you to the basic flow
of logic in the request/response cycle when Maestro is handling a call to one
of its endpoints.

_It is very important to realize that Elixir Phoenix expects convention over
configuration. This means that there are a number of things necessary to do (like
file and module names, file locations, etc. for everything to work right. This guide
seeks to explain what these common conventions are, but it is possible some have been
missed. Please see the [Elixir Phoenix documentation](https://phoenixframework.org/)
for more information._

## Routing (/web/router.ex)

The `router.ex` defines a set of routes that the incoming request is matched up
against. If a route is matched, it is handed off to the defined controller and
a ction. If the route is not matched, a `404` is returned.

There are a couple things uniqe to Elixir Phoenix when it comes to the `router.ex`
file. First, there are the two `pipeline` declarations. Within these declarations,
there are several plugs (see documentation on [Plugs](https://hexdocs.pm/phoenix/plug.html)).
A plug simply performs a
transformation on the incoming request object to prepare it for being matched to the
defined routes. For the `pipeline :browser` declaration, these plugs are called
_every time_ before attempting to match a route that is scoped to `:browser`.
Regarding the `pipeline :api` declaration, this can be ignored as it is not
actively being used right now.

The `scope "/", CrossroadsInterface` line is where the route definitions begin. First
there is a call to `pipe_through :browser`, which simply calls any plugs that are
defined in the `pipeline :browser` block. The next line contains a route definition:

`get "/group-leader/*path", CrdsGroupLeaderController, :index`

The first part of this route definition `get` is the HTTP verb. The next part is the
request path issued from the browser, `"/group-leader/*path`. The `*path` part is a
convention provided by Phoenix that allows a match on anything that starts with
`/group-leader/`. The third part, `CrdsGroupLeaderController` is the controller that is
handling the request (controllers are located in the `/web/controllers` directory).
It is important to note that Phoenix expects a convention of naming controllers such
that the word "Controller" is the last part of the controller name. Casing is also
important, and Phoenix expects that controllers be named in UpperCamelCase.
The last part (`:index`) is the action (or function) that is defined within the controller that
is responsible for handling the resolution of the request, returning a response when
it is completed. This is provided in the form of an atom, which simply means the name
of the function as it appears in the defined controller prepended with a colon `:`.

## Controllers (/web/controllers/crds_group_leader_controller.ex)

Once a route has been matched in the router, controll is handed off to a controller.
For this example, we will examine the CrdsGroupLeaderController. The first line of
this file defines a new module scoped to the `CrossroadsInterface` application. The
`use CrossroadsInterface.Web, :controller` line brings in some default functionality
that is universally needed by controllers. In this instance it gives us access to the
`render` function called on line 16. `require Logger` also gives us access to the
`Logger` module, allowing to make logging calls from within the controller. Next are
a series of plugs that get called _every time_ this controller gets used, regardless
of the function that is getting called from this controller. Lastly, there is a
function (known as an "action" within the Phoenix framework) defined in this
controller called `index`. `index` is defined with two arguments; `conn` and
`_params`. The convention of prepending a function's argument with an underscore
tells the Elixir compiler that this is an argument we do not intend to use, and
therefore a warning will not arise that we aren't using that argument.

`conn` is an Elixir Map data structure that contains data about the incoming request.
The next two lines contain a symbol that is probably new to anyone not familiar with
the Elixir programming language. `|>` is known as the pipe operator, and the way it
is used is often confusing to most. Please see `/documentation/elixir_crash_course`

Permit a small divergence to explain how this
works.

Many functional programming languages follow a convention of nested function calls
within other function calls. An example in pseudocode:

(downcase(join(split(capitalize("foobar bazshiz"), " "), "")))

The result of this call would be "foobarbazshiz", but as you can see, it is difficult
to read that logic. The pipe operator `|>` makes this kind of logic much more
readable:

capitalize("foobar bazshiz")
|> split(" ")
|> join("")
|> downcase()

What is important to understand is that `|>` implicitly provides the first argument
from the previously evaluated line of code. This means that the result of
`capitalize("foobar bazshiz")` automatically gets passed into the `split` function as
the first argument and the space separated quotes `" "` are actually the second
argument provided to the `split` function. Then the result of the call to `split`
gets passed in as the first argument to `join`, with the double quotes functioning as
the second argument to `join`. Finally the result of the `join` call gets passed in
as the only argument to `downcase`. That is a brief explanation of the Elixir `|>`
operator.

So going back to `conn` on line 14, it gets passed in as the first argument to
`CrossroadsInterface.Plug.RedirectCookie.call`, with `"/group-leader"` as the second
argument. After the call to that plug finishes, the result gets passed into the call
to `render` as the first argument, with `"app_root.html"` (the template into which
content will be rendered) as the second argument, and the third argument an Elixir
Map, which provides paths to the various .js and .css files necessary to render the
response correctly. Once that call to `render` finishes, a fully formed HTML
response is sent back to the browser.

That constitutes the basic lifecycle of the request response cycle in the
CrossroadsInterface portion of the Maestro application.

## Views

By convention, Elixir Phoenix requires a view to be defined to properly render a
template. Our example controller above was the
CrdsGroupLeaderController, and so in the `apps/crossroads_interface/web/views/`
directory there is a `crds_group_leader_view.ex` defined. Casing is important in
these file names. If you were to camelCase the filename instead of snake_case, the
Phoenix framework would not be able to find the file it is looking for.

Views create a common space to define functions that can be used in templates to
abstract out logic from the templates. This also allows users to reuse such methods
across any templates scoped to a particular controller. You can read more about view
files [here](https://hexdocs.pm/phoenix/views.html).

## Templates

Templates are files where HTML is contained. However, these templates include
snippets of EEX (evaluated elixir) code. You can see working examples of this eex
template syntax [here](https://hexdocs.pm/phoenix/templates.html).

It is important to note that these are the templates that are provided as a filename
in the `render` function within a controller.

## A Working Example

So lets that that a request has been made to create a page to display cat gifs on a
page. This will be a walkthrough of how to accomplish that. All paths provided here
assume that the root directory is `/apps/crossroads_interface`.

1. At `web/router.ex`, add a new route declaration:
  ```elixir
  get "/crazy-cat-gifs/", CatGifsController, :index
  ```
2. At `web/controllers/` create a new `CatGifsController.ex` file:
  ```elixir
  defmodule CrossroadsInterface.CatGifsController do
    use CrossroadsInterface.Web, :controller
  end
  ```
3. Within `web/controllers/CatGifsController.ex`, add an action definition:
  ```elixir
  def index(conn, _) do
    conn
    |> render conn, "index.html"
  end
  ```
4. At `web/views/` create a new `cat_gifs_view.ex` file:
  ```elixir
  defmodule CrossroadsInterface.CatGifsView do
    use CrossroadsInterface.Web, :view
  end
  ```
5. At `web/template/` create a new directory called `cat_gifs/`
6. At `web/template/cat_gifs/` create a new file called `index.html`
7. Within this `index.html` file, add your html.
8. Run `mix phoenix.server` from the terminal/command line
9. Navigate to `localhost:4000/crazy-cat-gifs/`
10. Enjoy your crazy cat gifs.
