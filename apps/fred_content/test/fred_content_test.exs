defmodule FredContentTest do
  use ExUnit.Case
  doctest FredContent
  alias FredContent.FakeHttp
  import Mock

  test "loads FRED data successfully" do
    with_mock HTTPoison, [get: fn(url, headers, options) -> FakeHttp.get(url, headers, options) end] do
      content = FredContent.fetch_form("goodForm", 2186211)
      assert content == "<div id='form'> </div>"
    end
  end

  test "sends cookie userId in request" do
    with_mock HTTPoison, [get: fn(url, headers, options) -> FakeHttp.get(url, headers, options) end] do
      FredContent.fetch_form("goodForm", 2186211)
      assert called HTTPoison.get("/goodForm?partial=true", %{}, hackney: [cookie: ["userId=2186211"]])
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

  test "gets form name" do
    name = FredContent.get_form_name(:url, "<div class='fred-form' id='formname'> </div>")
    assert name == "formname"
  end

  test "no form name is nil" do
    name = FredContent.get_form_name(:url2, "<div class='non-fred-form' id='formname'> </div>")
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
    name = FredContent.get_form_name(:url3, html)
    assert name == "formname"
  end

  test "caching form name based on unique key" do
    name = FredContent.get_form_name(:url, "<div class='fred-form' id='formname'> </div>")
    same_name = FredContent.get_form_name(:url,"<div class='fred-form' id='differentname'> </div>")
    assert same_name == "formname"
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
end
