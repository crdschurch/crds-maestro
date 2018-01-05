defmodule CrossroadsInterface.CmsSeriesView do
  use CrossroadsInterface.Web, :view

  def message_valid?(message) do
    (message["title"] != nil) &&
      (message["messageVideo"] != nil && message["messageVideo"] != %{}) &&
      (get_in(message, ["messageVideo", "source"]) != nil) &&
      (get_in(message, ["messageVideo", "still", "filename"]) != nil)
  end

  def get_message_still(message) do
    get_in(message, ["messageVideo", "still", "filename"])
  end

  def linkify_title(title) do
    String.replace(title, " ", "-")
  end
end
