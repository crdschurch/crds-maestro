defmodule CrossroadsInterface.SharedView do
  use CrossroadsInterface.Web, :view

  def filter_content_blocks(blocks, key, default \\ %{content: ""}) do
    Enum.find(blocks, default, fn(b) -> b["title"] == key end)
  end
end
