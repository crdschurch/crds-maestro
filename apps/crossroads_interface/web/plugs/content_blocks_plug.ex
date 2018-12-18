defmodule CrossroadsInterface.Plug.ContentBlocks do
  @moduledoc """
  Map content blocks from the CMS
  """
  import Plug.Conn
  alias CrossroadsContent.CmsClient

  def init(default), do: default

  def call(conn, _default) do
    case CmsClient.get_content_blocks() do
      {:ok, _, content_blocks} ->
        conn |> assign(:content_blocks, Map.get(content_blocks, "contentblocks", []))

      _ ->
        conn |> assign(:content_blocks, [])
    end
  end
end
