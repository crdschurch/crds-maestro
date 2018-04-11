defmodule CrossroadsInterface.Mixfile do
  use Mix.Project

  def project do
    [app: :crossroads_interface,
     version: revision("0.0.1"),
     elixir: "~> 1.0",
     elixirc_paths: elixirc_paths(Mix.env),
     dialyzer: [plt_add_deps: :transitive],
     compilers: [:phoenix, :gettext] ++ Mix.compilers,
     build_embedded: Mix.env == :prod,
     start_permanent: Mix.env == :prod,
     deps: deps()]
  end

  def application do
    if Mix.env == :test do
      [mod: {CrossroadsInterface, []},
       extra_applications: [:logger]]
    else
      [mod: {CrossroadsInterface, []},
       extra_applications: [:logger, :crossroads_content]]
    end
  end

  defp elixirc_paths(:test), do: ["lib", "web", "test/support"]
  defp elixirc_paths(_),     do: ["lib", "web"]

  defp deps do
    [{:phoenix, "~> 1.2.0"},
     {:phoenix_html, "~> 2.6"},
     {:phoenix_pubsub, "~> 1.0"},
     {:phoenix_html_sanitizer, "~> 1.0.0"},
     {:phoenix_live_reload, "~> 1.0", only: :dev},
     {:poison, "~> 3.1", override: true},
     {:mpx, "~> 0.1.9"},
     {:credo, "~> 0.8", only: [:dev, :test], runtime: false},
     {:dialyxir, "~> 0.5", only: [:dev], runtime: false},
     {:logger_file_backend, "0.0.9"},
     {:gettext, "~> 0.9"},
     {:cowboy, "~> 1.0"},
     {:crossroads_content, in_umbrella: true, runtime: false},
     {:mix_test_watch, "~> 0.2", only: :dev},
     {:mock, "~> 0.3.1", only: :test},
     {:timex, "~> 3.2"}]
  end

  defp revision(default_version) do
    case "#{System.get_env("PHOENIX_RELEASE_VERSION")}" do
      "" -> default_version
      nil -> default_version
      _ -> "#{System.get_env("PHOENIX_RELEASE_VERSION")}+#{System.get_env("CURRENT_TIMESTAMP")}"
    end
  end
end
