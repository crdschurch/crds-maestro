defmodule CrossroadsInterface.ProxyHttp do
  #TODO: pull this into it's own GenServer
  @gateway_server_endpoint Application.get_env(:crossroads_interface, :gateway_server_endpoint)

  @doc """
  Make a post request to the api server
  """
  def gateway_post(path, params, headers) do
    HTTPoison.post("#{@gateway_server_endpoint}#{path}",Poison.encode!(params), headers, [recv_timeout: :infinity])
  end

  @doc """
  Make a get request to the api server.
  """
  def gateway_get(path, headers) do
    HTTPoison.get("#{@gateway_server_endpoint}#{path}", headers, [recv_timeout: :infinity, ssl: [versions: [:"tlsv1.2"]]])
  end
end
