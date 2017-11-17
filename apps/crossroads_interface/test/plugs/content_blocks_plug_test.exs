defmodule CrossroadsInterface.Plugs.ContentBlocksTest do
  use CrossroadsInterface.ConnCase
  alias CrossroadsContent.CmsClient
  import Mock

  @content_block_call %{"contentBlocks" => [%{"id" => 1, "title" => "generalError"}]}
  @valid [%{"id" => 1, "title" => "generalError"}]
  @invalid []

  test "given CmsClient.get_content_blocks/0 returns :ok, assigns :content_blocks", %{conn: _conn} do
    with_mock CmsClient, [get_content_blocks: fn() -> {:ok, 200, @content_block_call} end] do
      conn = build_conn() |> CrossroadsInterface.Plug.ContentBlocks.call(%{})
      assert conn.assigns.content_blocks == @valid
    end
  end

  test "given CmsClient.get_content_blocks/0 returns anything other than :ok, assigns an empty list to :content_blocks", %{conn: conn} do
    with_mock CmsClient, [get_content_blocks: fn() -> {:error, 500, @content_block_call} end] do
      conn = conn |> CrossroadsInterface.Plug.ContentBlocks.call(%{})
      assert conn.assigns.content_blocks == @invalid
    end
  end

end

