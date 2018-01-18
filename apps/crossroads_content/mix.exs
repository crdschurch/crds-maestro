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
   [extra_applications: [:logger],
    mod: {CrossroadsContent, []}]
  end

  defp deps do
    [{:cachex, "~> 2.1"},
     {:httpoison, "~> 0.13"},
     {:poison, "~> 3.1"},
     {:credo, "~> 0.8", only: [:dev, :test], runtime: false},
     {:dialyxir, "~> 0.5", only: [:dev], runtime: false},
     {:mock, "~> 0.3.1", only: :test}
    ]
  end

  defp elixirc_paths(:test) do
    ["lib", "test/support"]
  end
  defp elixirc_paths(_), do: ["lib"]

end
