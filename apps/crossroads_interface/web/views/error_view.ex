defmodule CrossroadsInterface.ErrorView do
  use CrossroadsInterface.Web, :view
  alias CrossroadsContent.CmsClient
  require IEx

  def render("404.html", assigns) do
    render("404_page.html", assigns)
  end

  def render("500.html", assigns) do
    "500"
  end

  def template_not_found(_template, assigns) do
    render "404.html", assigns
  end

  def server_error_payload() do
    case CmsClient.get_page("/servererror/", false) do
      {:ok, _, body} ->
        page = body["pages"] |> List.first
        page["content"]
      _ ->
        ""
    end
  end
end
