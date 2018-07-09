*Understanding CrossroadsContent.Pages*

CrossroadsContent.Pages is a
[GenServer](https://hexdocs.pm/elixir/GenServer.html)
project that contains 4 methods for getting page data back from the
Silverstripe CMS. Those methods are:

- `get_page(url)`
- `get_page(url, stage)`
- `get_page_routes()`
- `get_page_cache()`

Each of these methods wrap a call to `GenServer.call(module, options, timeout)`.
The options data structure that is defined in the call to `GenServer.call` can
contain whatever data you wish to provide. When `GenServer.call` gets executed
it searches for a definition for `handle_call(options, from, data_object)` in
which options matches the options passed into the `GenServer.call`. For
example, CrossroadsContent.get_page looks like this:

```
def get_page(url) do
  GenServer.call(__MODULE__,
  {:get, url, false, Application.get_env(:crossroads_content, :cms_use_cache)},
  @timeout)
end
```

and the corresponding `handle_call` definition that matches the above function
looks like this:

```
def handle_call({:get, url, false, true}, _from, cms_page_cache) do
  {:reply, Map.fetch(cms_page_cache, url), cms_page_cache}
end
```

It is `handle_call` that does the heavy lifting and returns the requested data.
In the above example, a tuple is returned with the data that comes back from
fetching from the cms_page_cache with the url key.

This pattern plays out on the other functions that were specified above.
