defmodule CrossroadsInterface.CmsMessageController do
  use CrossroadsInterface.Web, :controller
  require Logger
  require IEx
  alias CrossroadsInterface.Plug

  plug Plug.Meta
  plug Plug.ContentBlocks
  plug Plug.BodyClass, "crds-styles"
  plug :put_layout, "screen_width.html"

  @base_url Application.get_env(:crossroads_content, :cms_server_endpoint)
  @timeout Application.get_env(:crossroads_content, :cms_timeout)

  def show(conn, %{"id" => id}) do
    message = get_decoded_message(id)
    render conn, "individual_message.html", %{message: message,
      css_files: [ "/css/app.css", "/js/legacy/legacy.css" ]
    }
  end

  defp get_decoded_message(id) do
    decoded_body = get_body(id)
      |>Poison.decode!()
      IEx.pry
    %{"messages" => [message]} = decoded_body
    message
  end

  defp get_body(id) do
    response = get_message_from_cms(id)

    message_body = case response do
      {:ok, %{body: body, headers: _headers, request_url: _req_url, status_code: 200}} ->
        body
      {:ok, %{body: body, headers: _headers, request_url: _req_url, status_code: status_code}} ->
        Logger.error("Error getting series data from CMS | Status: #{status_code} | Body: #{body}")
      {:error, data} ->
        Logger.error("Error getting series data from CMS: #{data}")
      err ->
        Logger.error("Error getting series data from CMS: #{err}")
    end

    message_body
  end

  defp get_message_from_cms(id) do
    HTTPoison.get("#{@base_url}/api/message?id=#{id}", %{"Accept" => "application/json"}, recv_timeout: @timeout)
  end
end
