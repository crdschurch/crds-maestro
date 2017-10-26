defmodule CrossroadsInterface.CmsPageView do
  use CrossroadsInterface.Web, :view
  require IEx

  ## currently only handles displaying one form
  def show_html(nil), do: ""
  def show_html(conn, payload) do
    IEx.pry
    conn.request_path
    |> FredContent.get_form_info(payload)
    |> determine_payload(payload)
    |> raw
  end

  defp determine_payload(nil, payload), do: payload
  defp determine_payload(%{form_id: form_id, redirect_url: redirect_url}, payload) do
    form_id
    |> FredContent.fetch_form(2186211, redirect_url)
    |> FredContent.inject_form(payload)
  end
  defp determine_payload(form, payload), do: payload
end
