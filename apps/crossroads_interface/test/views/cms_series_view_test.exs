defmodule CrossroadsInterface.CmsSeriesViewTest do
  use CrossroadsInterface.ConnCase
  alias CrossroadsInterface.CmsSeriesView

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

  @message_video_missing %{"date" => "2017-11-25", "id" => 3883}

  @still_missing %{"date" => "2017-11-25", "id" => 3883,
    "messageVideo" => %{
      "source" => %{"my_key" => "my_value"},
      "sourcePath" => "http://mystupidvideopath.com/mystupidvideo.mp4",
      "still" => %{
      }
    },
    "title" => "Say No To Good Things for the Sake of Great Things"}

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
