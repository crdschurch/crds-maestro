defmodule CrossroadsInterface.PublicationsViewTest do
  use CrossroadsInterface.ConnCase
  alias CrossroadsInterface.PublicationsView

  @content %{"heroImg" => %{"source" => "https://cdn.com/superawesome.jpg",
                            "caption" => "Super Awesome Caption"}}

  test "PublicationsView.get_article_hero/1 gets the hero image source" do
    expected = "https://cdn.com/superawesome.jpg"
    actual = PublicationsView.get_article_hero(@content) 

    assert actual == expected
  end

  test "PublicationsView.get_article_hero_caption/1 gets the hero image source" do
    expected = "Super Awesome Caption"
    actual = PublicationsView.get_article_hero_caption(@content) 

    assert actual == expected
  end
end
