defmodule CrossroadsInterface.ProxyGatewayController do
  use CrossroadsInterface.Web, :controller
  @moduledoc """
  Pass traffic from the frontend to the correct gateway endpoint.
  """

  alias CrossroadsInterface.ProxyHelpers
  alias CrossroadsInterface.ProxyHttp

  def handle_gateway_proxy(%{:method => "GET", :request_path => "/proxy/gateway/" <> request_path} = conn, params) do
    "#{request_path}?#{URI.encode_query(params)}"
    |> ProxyHttp.gateway_get(conn.req_headers)
    |> ProxyHelpers.match_response
    |> send_response(conn)
  end

  def handle_gateway_proxy(%{:method => "POST", :request_path => "/proxy/gateway/" <> request_path} = conn, params) do
    request_path
    |> ProxyHttp.gateway_post(params, conn.req_headers)
    |> ProxyHelpers.match_response
    |> send_response(conn)
  end

  def handle_gateway_proxy(%{:method => "PUT", :request_path => "/proxy/gateway" <> _request_path} = conn, _params) do
    conn
    |> put_resp_content_type("application/json")
    |> send_resp(200, "")
  end

  defp send_response({code, data}, conn) do
    conn
    |> put_resp_content_type("application/json")
    |> send_resp(code, data)
  end

end
