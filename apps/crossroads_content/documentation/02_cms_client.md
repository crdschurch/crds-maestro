*Understanding CrossroadsContent.CmsClient*

CrossroadsContent.CmsClient is a
[GenServer](https://hexdocs.pm/elixir/GenServer.html)
project that contains 4 methods for getting page data back from the
Silverstripe CMS. Those methods are:

- `get_site_config(id)`
- `get_content_blocks`
- `get_series_by_id(id)`
- `get_system_page(state_name)`
- `get_pages(stage)`
- `get_page(url, stage)`
- `get(url, params)`

Each of these methods wrap a call to `GenServer.call(module, options, timeout)`.
The options data structure that is defined in the call to `GenServer.call` can
contain whatever data you wish to provide. When `GenServer.call` gets executed
it searches for a definition for `handle_call(options, from, data_object)` in
which options matches the options passed into the `GenServer.call`. For
example, CrossroadsCmsClient.get_content_blocks looks like this:

```
def get_content_blocks do
  GenServer.call(__MODULE__, {:content_blocks}, @timeout)
end
```

and the corresponding `handle_call` definition that matches the above function
looks like this:

```
def handle_call({:content_blocks}, _from, state) do
  path = "contentblock"
  make_cached_call(path, state)
end
```

It is `handle_call` that does the heavy lifting and returns the requested data.
In the above example, a call is made to the private method `make_cached_call(path,
state)`, the result of which is returned back to the caller of
CmsClient.get_content_blocks.

This pattern plays out on the other functions that were specified above.
