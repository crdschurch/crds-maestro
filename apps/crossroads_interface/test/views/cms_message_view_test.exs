defmodule CrossroadsInterface.CmsMessageViewTest do
  require IEx
  use CrossroadsInterface.ConnCase
  alias CrossroadsInterface.CmsMessageView

  @good_response %{
    "id" => 3883,
    "title" => "Say No To Good Things for the Sake of Great Things",
    "date" => "2017-11-25", 
    "relatedMessages" => [%{
      "id" => 3858,
      "messageVideo" => %{
        "id" => 6105
      }
    }],
    "combinedTags" => [%{
      "id" => 583,
      "title" => "ChuckMingo",
      "date" => "304912-1243-22"
    }]
  }

  @bad_response %{
    "id" => 3883,
    "title" => "Say No To Good Things for the Sake of Great Things",
    "relatedMessages" => [],
    "combinedTags" => []
  }

  test "has_related_messages? returns true when all attributes are present" do
    actual = CmsMessageView.has_related_messages?(@good_response)
    expected = true

    assert actual == expected
  end
  
  test "has_related_messages? returns false when no related videos are found" do
    actual = CmsMessageView.has_related_messages?(@bad_response)
    expected = false
    
    assert actual == expected
  end
  
  test "has_topics? returns true when all attributes are present" do
    actual = CmsMessageView.has_topics?(@good_response)
    expected = true

    assert actual == expected
  end

  test "has_topics? returns false when no combined tags are found" do
    actual = CmsMessageView.has_topics?(@bad_response)
    expected = false
    
    assert actual == expected
  end

  test "convert_date_string returns a formatted date for good dates" do
    actual = CmsMessageView.convert_date_string(@good_response["date"])
    expected = "Saturday, November 25, 2017"
    assert actual == expected
  end
end
