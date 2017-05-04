defmodule CrossroadsInterface.NotFoundAssetsPlugTest do
  use CrossroadsInterface.ConnCase
  import IEx

  describe "NotFoundAssetsPlug: " do
    test "it should not modify response for root", %{conn: conn} do
      local_conn = CrossroadsInterface.Plug.NotFoundAssetsPlug.call(build_conn(:get, "/"),%{})
      assert local_conn.status == conn.status
    end

    test "it should return 'not found' for a root asset" , %{conn: conn} do
      local_conn = CrossroadsInterface.Plug.NotFoundAssetsPlug.call(build_conn(:get, "asset.svg"),%{})
      assert local_conn.status == 404
    end

    test "it should return 'not found' for an asset in subfolder" , %{conn: conn} do
      local_conn = CrossroadsInterface.Plug.NotFoundAssetsPlug.call(build_conn(:get, "/assets/asset.svg"),%{})
      assert local_conn.status == 404
    end

    test "it should not modify response found for a root 'non-asset'" , %{conn: conn} do
      local_conn = CrossroadsInterface.Plug.NotFoundAssetsPlug.call(build_conn(:get, "/assets/asset.aaa"),%{})
      assert local_conn.status == conn.status
    end

    test "it should not modify response for a 'non-asset' in an extended path" , %{conn: conn} do
      local_conn = CrossroadsInterface.Plug.NotFoundAssetsPlug.call(build_conn(:get, "/assets/asset.aaa"),%{})
      assert local_conn.status == conn.status
    end
    
    test "it should return 'not found' for a .php file" , %{conn: conn} do
      local_conn = CrossroadsInterface.Plug.NotFoundAssetsPlug.call(build_conn(:get, "/shouldnotbehere.php"),%{})
      assert local_conn.status == 404
    end

  end
end
