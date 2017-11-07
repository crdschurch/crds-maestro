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
     {:credo, "~> 0.5", only: [:dev, :test]},
     {:dialyxir, "~> 0.4", only: [:dev], runtime: false},
     {:distillery, "~> 1.0"},
     {:edeliver, "~> 1.4.0"} ]
  end

end
