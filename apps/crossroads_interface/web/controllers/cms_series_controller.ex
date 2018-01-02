defmodule CrossroadsInterface.CmsSeriesController do
  use CrossroadsInterface.Web, :controller
  alias CrossroadsInterface.Plug
  require IEx

  plug Plug.Meta
  plug Plug.ContentBlocks
  plug Plug.BodyClass, "crds-styles"
  plug :put_layout, "screen_width.html"

  @base_url Application.get_env(:crossroads_content, :cms_server_endpoint)
  @timeout Application.get_env(:crossroads_content, :cms_timeout)

  def show(conn, %{"id" => id}) do
    series = get_decoded_series(id)

    series_still = get_in(series, ["image", "filename"])
    series_title = series["title"]
    series_description = series["description"]
    series_start_date = series["startDate"]
    series_end_date = series["endDate"]
    series_messages = get_series_messages(series["messages"])

    render conn, "individual_series.html", %{series_title: series_title,
      series_description: series_description,
      series_still: series_still,
      series_start_date: series_start_date,
      series_end_date: series_end_date,
      series_messages: series_messages,
      css_files: [ "/css/app.css", "/js/legacy/legacy.css" ]
    }
  end

  defp get_series_messages(messages) do
    Enum.map(messages, fn(x) ->
      if still_filename_defined?(x) do get_message_data(x) end
    end )
    |> Enum.filter( fn(x) -> x != nil end )
  end

  defp still_filename_defined?(x) do
    get_in(x, ["messageVideo", "still", "filename"]) != nil
  end

  defp get_message_data(x) do
    %{title: x["title"],
    message_still: get_in(x, ["messageVideo", "still", "filename"]),
    message_id: x["id"],
    message_date: x["date"] }
  end

  defp get_decoded_series(id) do
    decoded_body = get_body(id)
      |>Poison.decode!()

    %{"series" => [series]} = decoded_body
    series
  end

  defp get_body(id) do
    {:ok, %{:body => body,
      :headers => _headers,
      :request_url => _request_url,
      :status_code => _status_code }} =
    "#{@base_url}/api/series?id=#{id}"
    |> HTTPoison.get(%{"Accept" => "application/json"}, recv_timeout: @timeout)

    body
  end
end

