defmodule CrossroadsInterface.CmsMessageView do
  use CrossroadsInterface.Web, :view

  def get_message_still(message) do
    get_in(message, ["messageVideo", "still", "filename"])
  end

  def linkify_title(title) do
    String.replace(title, " ", "-")
  end

  def has_related_messages?(message) do
    message["relatedMessages"] != [] && message["relatedMessages"] != nil
  end

  def has_topics?(message) do
    message["combinedTags"] != []
  end

  def convert_date_string(date) do
    {:ok, parsed_date} = Timex.parse(date, "%Y-%m-%d", :strftime)
    {:ok, formatted_date} = Timex.Format.DateTime.Formatters.Strftime.format(parsed_date, "%A, %B %d, %Y")
    formatted_date
  end
end
