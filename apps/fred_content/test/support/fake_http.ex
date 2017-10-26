defmodule FredContent.FakeHttp do
  def get("https://embedint.crossroads.net/fred/goodForm?partial=true", %{}, options) do
    {:ok, %HTTPoison.Response{
      status_code: 200,
      body: "<div id='form'> </div>"
    }}
  end

  def get("https://embedint.crossroads.net/fred/badForm?partial=true", %{}, options) do
    {:ok, %HTTPoison.Response{
      status_code: 500,
      body: "<p> Something went very badly. </p>"
    }}
  end

  def get("https://embedint.crossroads.net/fred/redirectForm?partial=true&redirecturl=https://google.com", %{}, options) do
    {:ok, %HTTPoison.Response{
      status_code: 200,
      body: "<a href='https://google.com'> </a>"
    }}
  end

  def get(url, headers, options) do
    {:error, %HTTPoison.Error{ reason: "BAD URL FOR TEST"}}
  end
end
