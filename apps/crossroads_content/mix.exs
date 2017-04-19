defmodule CrossroadsContent.Mixfile do
  use Mix.Project

  def project do
    [app: :crossroads_content,
     version: "0.0.1",
     build_path: "../../_build",
     config_path: "../../config/config.exs",
     deps_path: "../../deps",
     lockfile: "../../mix.lock",
     elixir: "~> 1.3",
     build_embedded: Mix.env == :prod,
     start_permanent: Mix.env == :prod,
     elixirc_paths: elixirc_paths(Mix.env),
     deps: deps()]
  end

  # Configuration for the OTP application
  #
  # Type "mix help compile.app" for more information
  def application do
   [applications: [:logger, :httpoison],
    mod: {CrossroadsContent, []}]
  end

  defp deps do
    [
      {:httpoison, "~> 0.9.0"},
      {:poison, "~> 2.0"},
      {:mock, "~> 0.2.0", only: :test}
    ]
  end

  def append_revision(version) do
    "#{version}+#{revision()}"
  end

  defp revision() do
    "git"
    |> System.cmd(["rev-parse", "--short", "HEAD"])
    |> elem(0)
    |> String.rstrip
  end

  defp elixirc_paths(:test) do
    ["lib", "test/support"]
  end
  defp elixirc_paths(_), do: ["lib"]

end
