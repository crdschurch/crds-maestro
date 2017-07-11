defmodule CrossroadsInterface.Plug.ContentBlocks do
  import Plug.Conn
  alias CrossroadsContent.CmsClient
  require IEx

  def init(default), do: default

  def call(conn, _default) do
    case CmsClient.get_content_blocks() do
      {:ok, _, content_blocks} ->
        conn |> assign(:content_blocks, Map.get(content_blocks, "contentBlocks", []))

      _ ->
        conn |> assign(:content_blocks, [])
    end
  end
end
