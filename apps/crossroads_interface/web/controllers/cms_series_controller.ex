defmodule CrossroadsInterface.CmsSeriesController do
  use CrossroadsInterface.Web, :controller
  alias CrossroadsInterface.Plug
  alias CrossroadsInterface.NotfoundController
  alias CrossroadsContent.CmsClient
  require Logger

  plug Plug.Meta
  plug Plug.ContentBlocks
  plug Plug.BodyClass, "crds-styles"
  plug :put_layout, "screen_width.html"

  @base_url Application.get_env(:crossroads_content, :cms_server_endpoint)
  @timeout Application.get_env(:crossroads_content, :cms_timeout)

  def show(conn, %{"id" => id}) do
    series = CmsClient.get_series_by_id(id)

    case series do
      {:ok, _response_code, %{"series" => series}} ->
        render conn, "individual_series.html", %{series: series,
          css_files: [ "/css/app.css", "/js/legacy/legacy.css" ]}
      {:error, _response_code, response_data} ->
        Logger.error("Error getting series data from CMS | Response: #{response_data["message"]}")
        NotfoundController.notfound(conn, %{})
      _ ->
        Logger.error("Error getting series data from CMS")
        NotfoundController.notfound(conn, %{})
    end
  end
end
