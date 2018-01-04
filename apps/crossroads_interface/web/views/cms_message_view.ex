defmodule CrossroadsInterface.CmsMessageView do
  use CrossroadsInterface.Web, :view

  def get_message_still(message) do
    get_in(message, ["messageVideo", "still", "filename"])
  end

  def linkify_title(title) do
    String.replace(title, " ", "-")
  end

  def has_related_messages?(message) do
    message["relatedMessages"] != []
  end

  def has_topics?(message) do
    message["combinedTags"] != []
  end
end
