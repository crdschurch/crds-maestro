defmodule CrossroadsInterface.Plug.ContentBlocks do
  import Plug.Conn
  alias CrossroadsContent.Pages
  require IEx

  def init(default), do: default

  def call(conn, _default) do
    case Pages.get_content_blocks() do
      {:ok, _, content_blocks} -> 
        conn |> assign(:content_blocks, Map.get(content_blocks, "contentBlocks", []))

      _ ->
        conn |> assign(:content_blocks, [])
    end
  end
end
