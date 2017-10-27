defmodule CrossroadsInterface.CmsPageView do
  use CrossroadsInterface.Web, :view

  @env Application.get_env(:crossroads_interface, :cookie_prefix, "")

  def show_html(conn, nil), do: raw("")
  def show_html(conn, payload) do
    conn.request_path
    |> FredContent.get_form_info(payload)
    |> determine_payload(payload, conn)
    |> raw
  end

  defp determine_payload(nil, payload, conn), do: payload
  defp determine_payload(%{form_id: form_id, redirect_url: redirect_url}, payload, conn) do
    contact_id = get_contact_id(conn)
    token = get_token(conn)
    form_id
    |> FredContent.fetch_form(contact_id, redirect_url)
    |> FredContent.inject_form(payload)
  end
  defp determine_payload(form, payload, conn), do: payload

  defp get_token(%{req_cookies: %{@env <> "sessionId" => token}}), do: token
  defp get_token(conn), do: ""

  defp get_contact_id(%{req_cookies: %{"userId" => contact_id}}), do: contact_id
  defp get_contact_id(conn), do: ""
end
