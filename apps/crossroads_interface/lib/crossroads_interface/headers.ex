defmodule CrossroadsInterface.Headers do
  @moduledoc """
  Utilities for HTTP headers
  """

  @doc """
  Do the headers include application/json?
  """
  @spec accepts_json([key: String.t]) :: boolean
  def accepts_json(headers) do
    case Enum.find(headers, fn({k,v}) -> k == "content-type" end) do
      {_, content_type} ->  content_type
                            |> String.split(",")
                            |> Enum.filter( &( &1 == "application/json"))
                            |> Enum.count() > 0
      _ -> false
    end
  end

end
