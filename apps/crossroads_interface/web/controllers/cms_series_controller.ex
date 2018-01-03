defmodule CrossroadsInterface.CmsSeriesController do
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
    series = get_decoded_series(id)

    render conn, "individual_series.html", %{series: series,
      css_files: [ "/css/app.css", "/js/legacy/legacy.css" ]
    }
  end

  defp get_decoded_series(id) do
    decoded_body = get_body(id)
      |>Poison.decode!()

    %{"series" => [series]} = decoded_body
    series
  end

  defp get_body(id) do
    response = get_series_from_cms(id)

    series_body = case response do
      {:ok, %{body: body, headers: _headers, request_url: _req_url, status_code: 200}} ->
        body
      {:ok, %{body: body, headers: _headers, request_url: _req_url, status_code: status_code}} ->
        Logger.error("Error getting series data from CMS | Status: #{status_code} | Body: #{body}")
      {:error, data} ->
        Logger.error("Error getting series data from CMS: #{data}")
      err ->
        Logger.error("Error getting series data from CMS: #{err}")
    end

    series_body
  end

  defp get_series_from_cms(id) do
    HTTPoison.get("#{@base_url}/api/series?id=#{id}", %{"Accept" => "application/json"}, recv_timeout: @timeout)
  end
end
