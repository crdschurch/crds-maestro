defmodule Media do

  alias CrossroadsContent.Pages

  # @spec
  def series_all_active do
    # TODO need to sort returned array
    case Pages.get_series_all do
      {:ok, 200, body} -> Map.get(body, "series", [])
      {_, _, _} -> []
    end
  end

  # TODO return sorted of active, current as the first in the list
  # so we do not hava a separate function to get current series

end