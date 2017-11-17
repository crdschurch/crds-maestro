defmodule CrossroadsContent.Mixfile do
  use Mix.Project

  def project do
    [app: :crossroads_content,
     version: "0.0.1",
     build_path: "../../_build",
     config_path: "../../config/config.exs",
     deps_path: "../../deps",
     lockfile: "../../mix.lock",
     elixir: "~> 1.4",
     build_embedded: Mix.env == :prod,
     start_permanent: Mix.env == :prod,
     elixirc_paths: elixirc_paths(Mix.env),
     aliases: aliases(),
     deps: deps()]
  end

  defp aliases do
  [
    test: "test --no-start"
  ]
  end

  def application do
   [applications: [:logger, :httpoison, :cachex],
    mod: {CrossroadsContent, []}]
  end

  defp deps do
    [ {:cachex, "~> 2.1"},
      {:httpoison, "~> 0.13"},
      {:poison, "~> 2.0"},
      {:mock, "~> 0.3.1", only: :test}
    ]
  end

  defp elixirc_paths(:test) do
    ["lib", "test/support"]
  end
  defp elixirc_paths(_), do: ["lib"]

end
