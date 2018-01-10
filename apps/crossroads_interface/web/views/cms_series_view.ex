defmodule CrossroadsInterface.CmsSeriesView do
  use CrossroadsInterface.Web, :view

  def message_valid?(message) do
    has_title?(message) && has_message_video?(message) && has_message_still?(message)
  end

  def get_message_still(message) do
    get_in(message, ["messageVideo", "still", "filename"])
  end

  def linkify_title(title) do
    String.replace(title, " ", "-")
  end

  defp has_title?(message) do
    (message["title"] != nil && message["title"] != "")
  end

  defp has_message_video?(message) do
    (message["messageVideo"] != nil && message["messageVideo"] != %{})
  end

  defp has_message_still?(message) do
    (get_in(message, ["messageVideo", "still", "filename"]) != nil)
  end

  def convert_date_string(date) do
    {:ok, parsed_date} = Timex.parse(date, "%Y-%m-%d", :strftime)
    {:ok, formatted_date} = Timex.Format.DateTime.Formatters.Strftime.format(parsed_date, "%m.%d.%Y")
    formatted_date
  end
end
