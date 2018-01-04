defmodule CrossroadsInterface.CmsSeriesController do
  use CrossroadsInterface.Web, :controller
  alias CrossroadsInterface.Plug
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
        render_not_found(conn)
      _ ->
        Logger.error("Error getting series data from CMS")
        render_not_found(conn)
    end
  end

  defp render_not_found(conn) do
    conn
    |> CrossroadsInterface.Plug.ContentBlocks.call("")
    |> CrossroadsInterface.Plug.Meta.call("")
    |> CrossroadsInterface.Plug.PutMetaTemplate.call("meta_tags.html")
    |> put_layout("no_sidebar.html")
    |> put_status(404)
    |> render(CrossroadsInterface.ErrorView, "404.html",
        %{"css_files": [ "/js/legacy/legacy.css" ]})
  end

end
