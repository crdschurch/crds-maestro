defmodule CrossroadsInterface.GatewayProxyMock do
  @moduledoc false

  def gateway_post(_path, %{"username" => "baduser", "password" => "badpass" }, headers) do
    {:ok, %HTTPoison.Response{
      body: "{\"abcdefg\": 1}",
      headers: headers,
      status_code: 500
    }}
  end

  def gateway_post(_path, _params, headers) do
    {:ok, %HTTPoison.Response{
      body: "{\"abcdefg\": 1}",
      headers: headers,
      status_code: 200
    }}
  end

  def gateway_get(_path, headers) do
    {:ok, %HTTPoison.Response{
      body: "{\"abcdefg\": 1}",
      headers: headers,
      status_code: 200
    }}
  end
end
