defmodule CrossroadsInterface.ProxyHelpers do
  require IEx
  @moduledoc """
    Utility methods for the proxy controllers
  """

  @doc """
  Match the response appropriatly.
  Returns a two-element tuple of status code (int) and body (map).
  """
  def match_response(resp) do
    case resp do
      {:ok, %HTTPoison.Response{status_code: 404, body: body}} ->
        {404, %{error: "route does not exist"}}
      {:ok, %HTTPoison.Response{status_code: status_code, body: body}} -> 
        {status_code, body}
      {:error, %HTTPoison.Error{reason: reason}} ->
        {500, %{error: reason}}
    end
  end
end
