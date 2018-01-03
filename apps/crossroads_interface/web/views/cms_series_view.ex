defmodule CrossroadsInterface.CmsSeriesView do
  use CrossroadsInterface.Web, :view

  def get_message_still(message) do
    get_in(message, ["messageVideo", "still", "filename"])
  end

  def linkify_title(title) do
    String.replace(title, " ", "-")
  end
end
