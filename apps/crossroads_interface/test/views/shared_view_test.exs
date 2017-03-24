defmodule CrossroadsInterface.SharedViewTest do
  use CrossroadsInterface.ConnCase, async: true
  alias CrossroadsInterface.SharedView

  @blocks [%{"id" => 1, "title" => "aBlock"},
           %{"id" => 2, "title" => "anotherBlock"},
           %{"id" => 3, "title" => "myBlock"}]

  @my_block %{"id" => 3, "title" => "myBlock"}

  test "filter_content_blocks/3 finds a contentBlock by its title" do
    assert SharedView.filter_content_blocks(@blocks, "myBlock") == @my_block
  end

  test "filter_content_blocks/3 returns %{:content => ''} when no content block is found" do
    assert SharedView.filter_content_blocks(@blocks, "fooBarBlock") == %{:content => ""}
  end

end

