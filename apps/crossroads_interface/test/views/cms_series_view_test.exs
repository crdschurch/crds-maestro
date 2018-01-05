defmodule CrossroadsInterface.CmsSeriesViewTest do
  use CrossroadsInterface.ConnCase
  alias CrossroadsInterface.CmsSeriesView

  @truthy_message %{"date" => "2017-11-25", "id" => 3883,
    "messageVideo" => %{
      "still" => %{
        "filename" => "https://crds-cms-uploads.imgix.net/media/messages/stills/Screen-Shot-2017-11-25-at-7.56.07-PM.png",
      }
    },
    "title" => "Say No To Good Things for the Sake of Great Things"}

  @falsy_message_1 %{"date" => "2017-11-25", "id" => 3883,
    "messageVideo" => %{
      "still" => %{} 
    },
    "title" => "Say No To Good Things for the Sake of Great Things"}

  @falsy_message_2 %{"date" => "2017-11-25", "id" => 3883,
    "messageVideo" => %{},
    "title" => "Say No To Good Things for the Sake of Great Things"}

  @falsy_message_3 %{"date" => "2017-11-25", "id" => 3883,
    "messageVideo" => %{
      "still" => %{
        "filename" => "https://crds-cms-uploads.imgix.net/media/messages/stills/Screen-Shot-2017-11-25-at-7.56.07-PM.png",
      }
    },
  }

  test "message_valid?(message) returns true when all attributes are present" do
    actual = CmsSeriesView.message_valid?(@truthy_message)
    expected = true

    assert actual == expected
  end

  test "message_valid?/1 returns false when video still is missing" do
    actual = CmsSeriesView.message_valid?(@falsy_message_1)
    expected = false

    assert actual == expected
  end

  test "message_valid?/1 returns false when video is missing" do
    actual = CmsSeriesView.message_valid?(@falsy_message_2)
    expected = false

    assert actual == expected
  end

  test "message_valid?/1 returns false when title is missing" do
    actual = CmsSeriesView.message_valid?(@falsy_message_3)
    expected = false

    assert actual == expected
  end

  test "get_message_still/1 returns path to remote image asset" do
    actual = CmsSeriesView.get_message_still(@truthy_message)
    expected = "https://crds-cms-uploads.imgix.net/media/messages/stills/Screen-Shot-2017-11-25-at-7.56.07-PM.png"

    assert actual == expected
  end

  test "linkify_title/1 replaces spaces with hyphens" do
    actual = CmsSeriesView.linkify_title("Here is my Magnificent title")
    expected = "Here-is-my-Magnificent-title"

    assert actual == expected
  end
end
