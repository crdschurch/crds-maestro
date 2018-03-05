defmodule CrossroadsInterface.CmsSeriesViewTest do
  use CrossroadsInterface.ConnCase
  alias CrossroadsInterface.CmsSeriesView

  @series_good_data [%{"message1" => "foo"}, %{"message2" => "bar"}]
  @series_bad_data_1 nil
  @series_bad_data_2 []
  @truthy_message %{"date" => "2017-11-25", "id" => 3883,
    "messageVideo" => %{
      "source" => %{"my_key" => "my_value"},
      "sourcePath" => "http://mystupidvideopath.com/mystupidvideo.mp4",
      "still" => %{
        "filename" => "https://crds-cms-uploads.imgix.net/media/messages/stills/Screen-Shot-2017-11-25-at-7.56.07-PM.png",
      }
    },
    "title" => "Say No To Good Things for the Sake of Great Things"}

  @title_missing %{"date" => "2017-11-25", "id" => 3883,
    "messageVideo" => %{
      "source" => %{"my_key" => "my_value"},
      "sourcePath" => "http://mystupidvideopath.com/mystupidvideo.mp4",
      "still" => %{
        "filename" => "https://crds-cms-uploads.imgix.net/media/messages/stills/Screen-Shot-2017-11-25-at-7.56.07-PM.png",
      }
    }
  }

  @still_missing %{"date" => "2017-11-25", "id" => 3883,
    "messageVideo" => %{
      "source" => %{"my_key" => "my_value"},
      "sourcePath" => "http://mystupidvideopath.com/mystupidvideo.mp4",
      "still" => %{
      }
    },
    "title" => "Say No To Good Things for the Sake of Great Things"}

  test "has_messages?/1 returns true when map has messages" do
    actual = CmsSeriesView.has_messages?(@series_good_data)
    expected = true

    assert actual == expected
  end

  test "has_messages?/1 returns false when map does not have messages" do
    actual = CmsSeriesView.has_messages?(@series_bad_data_1)
    expected = false

    assert actual == expected
  end

  test "has_messages?/1 returns false when map has an empty list for the values of messages" do
    actual = CmsSeriesView.has_messages?(@series_bad_data_2)
    expected = false

    assert actual == expected
  end

  test "message_valid?(message) returns true when all attributes are present" do
    actual = CmsSeriesView.message_valid?(@truthy_message)
    expected = true

    assert actual == expected
  end

  test "message_valid?/1 returns false when video still is missing" do
    actual = CmsSeriesView.message_valid?(@still_missing)
    expected = false

    assert actual == expected
  end

  test "message_valid?/1 returns false when message video is missing" do
    actual = CmsSeriesView.message_valid?(@still_missing)
    expected = false

    assert actual == expected
  end

  test "message_valid?/1 returns false when title is missing" do
    actual = CmsSeriesView.message_valid?(@title_missing)
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
