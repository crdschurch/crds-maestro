defmodule CrossroadsClient.Mixfile do
  use Mix.Project

  def project do
    [apps_path: "apps",
     build_embedded: Mix.env == :prod,
     start_permanent: Mix.env == :prod,
     deps: deps()]
  end

  defp deps do
    [{:mix_test_watch, "~> 0.3", only: :dev, runtime: false},
     {:credo, "~> 0.8", only: [:dev, :test], runtime: false},
     {:dialyxir, "~> 0.5", only: [:dev], runtime: false},
     {:distillery, "~> 1.0", runtime: false}]
  end
end
