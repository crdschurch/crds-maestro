# Debugging Elixir Code

At times you may find yourself needing to debug elixir code. Unfortunately this is
not the easiest task to do, but hopefully this documentation will make it easier on
you.

The first thing you need to do when attempting to debug a source code file is require
the `IEx` library that comes as part of Elixir's available libraries. This can be
done by including the line `require IEx` at the top of a source code file.

Then you add the line `IEx.pry` between lines of code in the file to create a
breakpoint. Next, you execute `iex -S mix phoenix.server` at the command line and
navigate to the endpoint in your application that exercises the code in the file that
you are attempting to debug. At the command line, you should see a pry session asking
you if you wish to step into the code. If you choose yes, you have the ability to
inspect in-scope variables and state.

Once you are finishing inspecting, you can type `respawn()` and execution will
resume. If you have multiple breakpoints, `respawn()` will take you to the next
breakpoint you defined.

# Debugging Elixir Unit Tests

The process of debugging a unit test is very similar to that of debugging plain
elixir code. You still need to `require IEx` at the top of the unit test file, and
you still need to drop an `IEx.pry` command between the lines that you wish to break
at.

Finally, you need to run the `iex -S mix test --trace` command. This will run the
test suite and break when it gets to the `IEx.pry` line you inserted. After you have
finished debugging, typing `respawn()` will continue execution.

The `--trace` flag is necessary to have on this command if you don't wish to timeout
your debug session. Excluding the `--trace` flag will usually result in a timeout
around 30 seconds.

# Debugging with IO.puts

At times you may find yourself wanting to just print out text to the console while
debugging. This can be accomplished by using `IO.puts(args)` command. This will
output anything to the console that implements a `to_string` function.
