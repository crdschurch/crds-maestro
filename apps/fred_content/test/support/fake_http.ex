defmodule FredContent.FakeHttp do
  def get("/goodForm?partial=true", %{}, options) do
    {:ok, %HTTPoison.Response{
      status_code: 200,
      body: "<div id='form'> </div>"
    }}
  end

  def get("/badForm?partial=true", %{}, options) do
    {:ok, %HTTPoison.Response{
      status_code: 500,
      body: "<p> Something went very badly. </p>"
    }}
  end

  def get(url, headers, options) do
    {:error, %HTTPoison.Error{ reason: "BAD URL FOR TEST"}}
  end
end
