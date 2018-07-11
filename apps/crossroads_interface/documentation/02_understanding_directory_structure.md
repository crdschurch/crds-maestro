# Project Directory Structure

* crossroads_interface
  * [build/](#build)
  * [config/](#config)
    * config.exs
    * dev.exs
    * prod.exs
    * test.exs
  * [deps/](#deps)
  * [documentation/](#documentation)
  * [lib/](#lib)
    * crossroads_interface/
      * endpoint.ex
      * proxy_helpers.ex
    * content_helpers.ex
    * crossroads_interface.ex
  * [node_modules/](#node_modules)
  * [priv/](#priv)
  * [test/](#test)
  * [web/](#web)
    * [channels/](#channels)
    * [controllers/](#controllers)
    * [plugs/](#plugs)
    * [static/](#static)
    * [templates/](#templates)
    * [views/](#views)
    * [gettext.ex](#gettext)
    * [router.ex](#router)
    * [web.ex](#web)
  * [brunch-config.js](#brunch-config)
  * [karma.conf.js](#karma-conf)
  * [mix.exs](#mix.exs)
  * [mix.lock](#mix.lock)
  * [package-lock.json](#package-lock)
  * [package.json](#package.json)
  * [README.md](#readme)

# build
This directory contains the resultant files of running the `mix compile` command. The
`mix compile` command gets run implicitly when the `mix phoenix.server` command is
run. If no meaningful changes have been made to the project, Phoenix will use a
cached version of the build files so as to speed up the time to starting up the
development server.

# config
Contains 4 configuration files; 1 default file (config.exs) and 3 environment
specific files (dev.exs, test.exs, prod.exs). These files primarily contain API key
values that are fetched from environment variables set on the various host machines.
Also included are things like logging configurations, server port number, code hot
reloading, etc.

# deps
This file contains the dependencies that are installed as a result of running `mix
deps.get`. It is analogous to the `node_modules` directory that gets created after
running `npm install` in a JavaScript project that contains a `package.json` file.

# documentation
Self Explanatory

# lib
## crossroads_interface
### endpoint.ex

From the official documentation:

>> Overall, an endpoint has three responsibilities:
>> * to provide a wrapper for starting and stopping the endpoint as part of a
>>   supervision tree
>> * to define an initial plug pipeline for requests to pass through
>> * to host web specific configuration for your application

You can read more about the endpoint.ex file
[here](https://hexdocs.pm/phoenix/Phoenix.Endpoint.html).

### proxy_helpers.ex
A file that provides utility methods for the proxy controllers. Currently it does not
appear to be used anywhere in the project.

## content_helpers.ex
Contains helper utility methods to assist with calls to CrossroadsContent.CmsClient.

## crossroads_interface.ex
This file is responsible for starting up and orchestrating the various processes that
make up the CrossroadsInterface module. These processes implement the
[Elixir Supervisor](https://hexdocs.pm/elixir/Supervisor.html) module.

Configuring the project this way is important as it allows for critical failure of
one of these processes and the Supervisor is able to start up another process almost
instantaneously.

# node_modules
Self Explanatory

# priv
Contains files that are necessary for that application to run and live side by side
with the application on the server.

# test
Contains unit test files for the controllers, plugs, etc. of the CrossroadsInterface
project.

# web
## channels
This directory contains a single, unused file and is intended to hold files responsible for
creating and maintaining socketed connections. Currently Maestro doesn't do anything
with socketed connections, and so there are not any additional files in this
directory.

## controllers
This directory contains the various controllers necessary to handle traffic and
deliver responses back to the browser.

## plugs
Contains files that are termed plugs. Plugs are small bits of code that perform a
defined transformation on a request. You can find instances of their use in both the
`router.ex` file as well as many of the controllers. You can read more about plugs
and how they are used [here](https://hexdocs.pm/phoenix/plug.html).

## static
This directory contains 5 subdirectories; assets/, css/, icons/, js/, and vendor/.
These directories contains the static assets that get delivered to the browser when a
request completes and a response is sent to the browser.

## templates
Contains directories that correspond to the various controller names. Within each of
these subdirectories are the templates that format the response html.

## views
Views are responsible for rendering templates, but they also can contain function
definitions that help with taking raw data and make it easier for templates to
consume that data. For more information on Elixir Phoenix Views, please read more
[here](https://hexdocs.pm/phoenix/views.html).

## gettext
A file that enables Internationalization within the application. Currently this is
not leveraged at all.

## router
`router.ex` is where all routing definitions exist. There are a couple of things
going on in this file. First,
[pipelines](https://hexdocs.pm/phoenix/routing.html#pipelines) are defined; one for
`:browser` and one for `:api`. Within these pipelines a number of plugs are called.
The plugs that are not prefixed with `CrossroadsInterface.Plug` are built into the
Elixir Phoenix framework. Those that are prefixed with `CrossroadsInterface.Plug` are
custom plugs written by the Crossroads organization developers. Currently the `:api`
pipeline is not actively used in this project. Pipelines get run each time before
a match to a route is made.

The second thing that is happening in this file is that of route definitions. The
syntax for defining a route is as follows:

[html verb] "/url/string/to/match?with=parameters", (NameOfController,
{:name_of_action}

It is important to define any routes from most specific to least specific, otherwise
there will be unexpected matching of a route like `/my/super/cool/route/` to `/my/`.

## web
`web.ex` gives a file access to `model`, `controller`, `view`, `router`, and `channel`
functionality. You can see its use in the various controller files as:

`use CrossroadsInterface.Web, :controller`.

You can also see its use in the `router.ex` file.

# brunch-config
Brunch is an asset build tool with built in linting. The brunch-config.js file is
configuration for the build tool.

# karma-conf
As we have a few modules of JavaScript code defined in the Maestro project, there are
unit tests present for those modules. The karma.conf.js file serves as configuration
for the Karma test runner for those tests.

# mix.exs
Similar to a JavaScript `package.json` file, the mix.exs file is where project
metadata is defined, as well project dependencies.

# mix.lock
A lock file for the dependency versions in the project.

# package-lock
A lock file for JavaScript dependencies

# package.json
A file that defines JavaScript dependencies that the code uses.

# readme
A file that describes the project and the steps necessary to get it set up and
running.
