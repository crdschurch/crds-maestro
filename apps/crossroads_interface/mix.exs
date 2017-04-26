defmodule CrossroadsInterface.Mixfile do
  use Mix.Project

  def project do
    [app: :crossroads_interface,
     version: revision("0.0.1"),
     elixir: "~> 1.0",
     elixirc_paths: elixirc_paths(Mix.env),
     compilers: [:phoenix, :gettext] ++ Mix.compilers,
     build_embedded: Mix.env == :prod,
     start_permanent: Mix.env == :prod,
     deps: deps()]
  end

  defp revision(default_version) do
    case "#{System.get_env("PHOENIX_RELEASE_VERSION")}" do
      "" -> default_version
      nil -> default_version
      _ -> "#{System.get_env("PHOENIX_RELEASE_VERSION")}+#{System.get_env("CURRENT_TIMESTAMP")}"
    end
  end

  def application do
    [mod: {CrossroadsInterface, []},
     applications: [:phoenix, :phoenix_html, :logger_file_backend, :cowboy, :logger, :gettext, :crossroads_content, :ssl]]
  end

  defp elixirc_paths(:test), do: ["lib", "web", "test/support"]
  defp elixirc_paths(_),     do: ["lib", "web"]

  defp deps do
    [{:phoenix, "~> 1.1.3"},
     {:phoenix_html, "~> 2.3"},
     {:phoenix_live_reload, "~> 1.0", only: :dev},
     {:logger_file_backend, "0.0.9"},
     {:gettext, "~> 0.9"},
     {:cowboy, "~> 1.0"},
     {:crossroads_content, in_umbrella: true},
     {:mix_test_watch, "~> 0.2", only: :dev},
     {:mock, "~> 0.2.0", only: :test}]
  end
end
