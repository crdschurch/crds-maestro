defmodule CrossroadsInterface.Headers do
  @moduledoc """
  Utilities for HTTP headers
  """
  
  require IEx
  @doc """
  Does the headers include application/json?
  """
  def accepts_json(headers) do
    {_, content_type} = Enum.find(headers, fn({k,v}) -> k == "content-type" end)
    filtered_headers = content_type
                       |> String.split(",")
                       |> Enum.filter( &( &1 == "application/json"))
    Enum.count(filtered_headers) > 0
  end

end
