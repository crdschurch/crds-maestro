defmodule CrossroadsInterface.CmsPageView do
  use CrossroadsInterface.Web, :view


  # should we only get the first one, or
  # support showing many forms on the page?
  def show_html(nil), do: ""
  def show_html(payload) do
    payload
#    |> Floki.find(".fred-form")
    #|> Floki.attribute("id")
    #|> List.first
    #|> grab_fred_data
    #|> inject_into_body(payload)
    #|> Floki.raw_html
    #|> raw
  end
end
