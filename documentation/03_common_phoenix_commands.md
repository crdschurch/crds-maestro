# Common Elixir Phoenix Command Line Commands
During the course of developing within Maestro, it will be necessary to execute a
number of commands from the command line. This document enumerates and elaborates on
the most common of those commands.

- `mix deps.get` - This command installs the dependencies necessary to the project.
- `mix phoenix.server` - This command starts a Cowbow development server. The result
  is that you can access the project at `localhost:4000/`. Running this command will
  also run `mix compile` in the event that the project needs to compile source code
  before serving it up.
- `mix compile` - This will compile the source code files. If a cache of those files
  is present, this command will use that cache instead of recompiling the project. In
  the event that you need to recompile and the project is using the cache, you can
  add a `--force` flag to the `mix compile` command to force a recompilation.

In the event that debugging the application or unit tests is needed, the following
commands will help in that effort:

- For debugging application code: `iex -S mix phoenix.server`
- For debugging unit test code: `iex -S mix test --trace`

For more information on debugging, please reference the `dubugging.md` document in
this directory.
