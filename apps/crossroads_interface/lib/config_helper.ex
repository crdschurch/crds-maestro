defmodule ConfigHelper do
  def get_suffix do
    get_maestro_name_extension() <> get_environment()
  end

  defp get_maestro_name_extension do
    case System.get_env("MAESTRO_NAME_EXTENSION") do
      "" -> ""
      nil -> ""
      _ -> System.get_env("MAESTRO_NAME_EXTENSION")
    end
  end

  defp get_environment do
    case System.get_env("CRDS_ENV") do
      "" -> ""
      nil -> ""
      _ -> "-" <> System.get_env("CRDS_ENV")
    end
  end
end
