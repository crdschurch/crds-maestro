defmodule FredContentTest do
  use ExUnit.Case, async: true
  doctest FredContent
  alias FredContent.FakeHttp
  import Mock

  setup do
    on_exit fn ->
      Cachex.clear(:fred_cache)
    end
    :ok
  end

  test "loads FRED data successfully" do
    with_mock HTTPoison, [get: fn(url, headers, options) -> FakeHttp.get(url, headers, options) end] do
      content = FredContent.fetch_form("goodForm", 2186211)
      assert content == "<div id='form'> </div>"
    end
  end

  test "sends cookie userId in request" do
    with_mock HTTPoison, [get: fn(url, headers, options) -> FakeHttp.get(url, headers, options) end] do
      FredContent.fetch_form("goodForm", 2186211)
      assert called HTTPoison.get("https://embedint.crossroads.net/fred/goodForm?partial=true", %{}, hackney: [cookie: ["userId=2186211"]])
    end
  end

  test "handles redirect correctly" do
    with_mock HTTPoison, [get: fn(url, headers, options) -> FakeHttp.get(url, headers, options) end] do
      content = FredContent.fetch_form("redirectForm", 2186211, "https://google.com")
      assert content == "<a href='https://google.com'> </a>"
      assert called HTTPoison.get("https://embedint.crossroads.net/fred/redirectForm?partial=true&redirecturl=https://google.com", %{}, hackney: [cookie: ["userId=2186211"]])
    end
  end

  test "form does not exist, error message" do
    with_mock HTTPoison, [get: fn(url, headers, options) -> FakeHttp.get(url, headers, options) end] do
      content = FredContent.fetch_form("badForm", 2186211)
      assert content == "<p> Something went very badly. </p>"
    end
  end

  test "error getting FRED data, empty string returned" do
    with_mock HTTPoison, [get: fn(url, headers, options) -> FakeHttp.get(url, headers, options) end] do
      content = FredContent.fetch_form("error", 2186211)
      assert content == ""
    end
  end

  test "caches form data" do
    with_mock HTTPoison, [get: fn(url, headers, options) -> FakeHttp.get(url, headers, options) end] do
      content = FredContent.fetch_form("goodForm", 2186211)
      assert Cachex.exists?(:fred_cache, "goodForm2186211") == {:ok, true}
    end
  end

  test "gets form name" do
    name = FredContent.get_form_info(:url, "<div class='fred-form' id='formname'> </div>")
    assert name == %{form_id: "formname", redirect_url: nil}
  end

  test "no form name is nil" do
    name = FredContent.get_form_info(:url2, "<div class='non-fred-form' id='formname'> </div>")
    assert name == nil
  end

  test "get form name for deeply nested html still works" do
    html = """
    <div>
      <div>
        <span>
          <div class='fred-form' id='formname'> </div>
        </span>
      </div>
    </div>
    """
    name = FredContent.get_form_info(:url3, html)
    assert name == %{form_id: "formname", redirect_url: nil}
  end

  test "caching form name based on unique key" do
    name = FredContent.get_form_info(:url, "<div class='fred-form' id='formname'> </div>")
    same_name = FredContent.get_form_info(:url,"<div class='fred-form' id='differentname'> </div>")
    assert same_name == %{form_id: "formname", redirect_url: nil}
  end

  test "injects form into payload" do
    payload = "<div class='fred-form' id='formname'> </div>"
    form = "<div id=\"formio\">hello</div>"
    newpayload = FredContent.inject_form(form, payload)
    assert form == newpayload
  end

  test "nil form does not need injecting" do
    payload = "<div class='fred-form' id='formname'> </div>"
    form = nil
    newpayload = FredContent.inject_form(form, payload)
    assert payload == newpayload
  end

  test "nested payload is not effected by injecting form" do
    payload = """
    <div>
    <p>
    <div class='fred-form' id='formname'> </div>
    </p>
    </div>
    """
    form = "<div id=\"formio\">hello</div>"
    newpayload = FredContent.inject_form(form, payload)
    expected = "<div><p><div id=\"formio\">hello</div></p></div>"
    assert expected == newpayload
  end

  @tag :integration
  test "connects to fred and pulls back html" do
    content = FredContent.fetch_form("campercampingcamp", 2186211)
    assert content =~ "\"title\": \"Camper Camping Camp Sign Up\""
  end

  @tag :integration
  test "http call cache should timeout after configured time (5 seconds)" do
    content = FredContent.fetch_form("campercampingcamp", 2186211)
    assert Cachex.exists?(:fred_cache, "campercampingcamp2186211") == {:ok, true}
    :timer.sleep(Application.get_env(:fred_content, :http_cache_ttl, 5000));
    assert Cachex.exists?(:fred_cache, "campercampingcamp2186211") == {:ok, false}
  end

  @tag :integration
  test "formname cache should timeout after configured time (6 seconds)" do
    name = FredContent.get_form_info(:url, "<div class='fred-form' id='formname'> </div>")
    :timer.sleep(Application.get_env(:fred_content, :formname_cache_ttl, 6000));
    same_name = FredContent.get_form_info(:url,"<div class='fred-form' id='differentname'> </div>")
    assert same_name == "differentname"
  end
end
