defmodule FredContent.Mixfile do
  use Mix.Project

  def project do
    [app: :fred_content,
     version: "0.1.0",
     build_path: "../../_build",
     config_path: "../../config/config.exs",
     deps_path: "../../deps",
     lockfile: "../../mix.lock",
     elixir: "~> 1.4",
     elixirc_paths: elixirc_paths(Mix.env),
     build_embedded: Mix.env == :prod,
     start_permanent: Mix.env == :prod,
     dialyzer: [plt_add_deps: :transitive],
     deps: deps()]
  end

  def application do
    [extra_applications: [:logger],
     mod: {FredContent.Application, []}]
  end

  defp deps do
    [{:httpoison, "~> 0.13", override: true},
     {:mock, "~> 0.3.1", only: :test},
     {:credo, "~> 0.8", only: [:dev, :test]},
     {:dialyxir, "~> 0.5", only: [:dev], runtime: false, },
     {:mix_test_watch, "~> 0.2", only: :dev, runtime: false},
     {:floki, "~> 0.18.1"}]
  end

  defp elixirc_paths(:test) do
    ["lib", "test/support"]
  end
  defp elixirc_paths(_), do: ["lib"]
end
