*CrossroadsContent module definition file*

This file is responsible for starting up and orchestrating the various processes that
make up the CrossroadsContent module. These processes implement the
[Elixir Supervisor](https://hexdocs.pm/elixir/Supervisor.html) module. The child
processes are constituted of the following:

- [Cachex](https://hexdocs.pm/cachex/Cachex.html)
- CrossroadsContent.CmsClient
- CrossroadsContent.Pages
- CrossroadsContent.PublicationsClient

Configuring the project this way is important as it allows for critical failure of
one of these processes and the Supervisor is able to start up another process almost
instantaneously.
