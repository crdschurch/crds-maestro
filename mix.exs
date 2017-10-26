defmodule CrossroadsClient.Mixfile do
  use Mix.Project

  def project do
    [apps_path: "apps",
     build_embedded: Mix.env == :prod,
     start_permanent: Mix.env == :prod,
     deps: deps()]
  end

  defp deps do
    [{:mix_test_watch, "~> 0.2", only: :dev},
     {:credo, "~> 0.8", only: [:dev, :test]},
     {:dialyxir, "~> 0.5", only: [:dev], runtime: false},
     {:distillery, "~> 1.0"},
     {:mochiweb, "~> 2.15", override: true}]
  end

end
