defmodule CrossroadsInterface.NotFoundAssetsPlugTest do
  use CrossroadsInterface.ConnCase

  describe "NotFoundAssetsPlug: " do
    test "it should not modify response for root", %{conn: conn} do
      local_conn = CrossroadsInterface.Plug.NotFoundAssetsPlug.call(conn(:get, "/"),%{})
      assert local_conn.status == conn.status
    end

    test "it should return 'not found' for a root asset" , %{conn: _conn} do
      local_conn = CrossroadsInterface.Plug.NotFoundAssetsPlug.call(conn(:get, "asset.svg"),%{})
      assert local_conn.status == 404
    end

    test "it should return 'not found' for an asset in subfolder" , %{conn: _conn} do
      local_conn = CrossroadsInterface.Plug.NotFoundAssetsPlug.call(conn(:get, "/assets/asset.svg"),%{})
      assert local_conn.status == 404
    end

    test "it should not modify response found for a root 'non-asset'" , %{conn: conn} do
      local_conn = 
      :get |> conn("/assets/asset.aaa")

      after_plug = 
      local_conn |> CrossroadsInterface.Plug.NotFoundAssetsPlug.call(%{})
      assert local_conn.status == after_plug.status
    end

    test "it should not modify response for a 'non-asset' in an extended path" , %{conn: conn} do
      local_conn = 
      :get |> conn("/assets/asset.aaa", %{})

      after_plug = 
      local_conn |> CrossroadsInterface.Plug.NotFoundAssetsPlug.call(%{})
      assert local_conn.status == conn.status
    end
    
    test "it should return 'not found' for a .php file" , %{conn: _conn} do
      local_conn = CrossroadsInterface.Plug.NotFoundAssetsPlug.call(conn(:get, "/shouldnotbehere.php"),%{})
      assert local_conn.status == 404
    end

  end
end
