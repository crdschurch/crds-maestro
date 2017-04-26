defmodule CrossroadsContent do
  use Application

  @doc false
  def start(_type, _args) do
    import Supervisor.Spec, warn: false

    children = [
      worker(CrossroadsContent.Pages, [[name: CrossroadsContent.Pages]]),
    ]

    opts = [strategy: :one_for_one]
    Supervisor.start_link(children, opts)
    Supervisor.start_link(
      [
        worker(Cachex, [:cms_cache, [default_ttl: Application.get_env(:crossroads_content, :cms_cache_ttl)]])
      ], opts
    )
  end
end
