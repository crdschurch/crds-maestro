defmodule Media do

  alias CrossroadsContent.Pages

  # @spec series :: [map]
  def series_all_active do
    case Pages.get_series_all do
      {:ok, 200, body} -> Map.get(body, "series", [])
      {_, _, _} -> []
    end
  end

  # @spec series :: [map]
  def series_current do
    case Pages.get_series_current do
      {:ok, 200, body} -> Map.get(body, "series", [])
      {_, _, _} -> []
    end
  end  

  # @spec digital_program :: [map]
  def digital_program do
    case Pages.get_digital_program do
      {:ok, 200, body} -> Map.get(body, "features", [])
      {_, _, _} -> []
    end
  end  

end