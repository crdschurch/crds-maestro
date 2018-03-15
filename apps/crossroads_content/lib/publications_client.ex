defmodule CrossroadsContent.PublicationsClient do
  @moduledoc """
  Handles getting all content from the CMS
  """
  use GenServer
  require Logger

  @base_url Application.get_env(:crossroads_content, :publications_server_endpoint)
  @timeout Application.get_env(:crossroads_content, :cms_timeout)

  @doc false
  def start_link(opts \\ []) do
    GenServer.start_link(__MODULE__, :ok, opts)
  end

  @doc false
  def init(:ok) do
    {:ok, %{}}
  end

  @spec get_articles() :: {:ok | :error, map}
  def get_articles() do
    GenServer.call(__MODULE__, {:articles}, @timeout)
  end

  @doc false
  def handle_call({:articles}, _from, state) do
    path = "/v1/articles"
    make_call(path, state)
  end

  @spec get_article(Integer, Integer) :: {:ok | :error, map}
  def get_article(id, source) do
    GenServer.call(__MODULE__, {:articles, id, source}, @timeout)
  end

  @doc false
  def handle_call({:articles, id, source}, _from, state) do
    path = "/v1/articles/#{id}/#{source}"
    make_call(path, state)
  end

  @spec make_call(String.t, Map) :: {:reply, {:ok | :error, number(), any()}, map()}
  defp make_call(path, state) do
    result =
      "#{@base_url}#{path}"
      |> HTTPoison.get(%{"Accept" => "application/json"})
      |> match_response
    {:reply, result, state}
  end

  @spec match_response({:ok | :error, HTTPoison.Response.t}) :: {:ok | :error, number(), any()}
  defp match_response({:ok, %HTTPoison.Response{status_code: 404, body: body}}) do
    {:error, 404, decode_request(Poison.decode(body))}
  end

  defp match_response({:ok, %HTTPoison.Response{status_code: 200, body: body, headers: headers, request_url: _req_url}}) do
    if determine_headers(headers) do
      {:error, 400, %{}}
    else
      {:ok, 200, decode_request(Poison.decode(body))}
    end
  end

  defp match_response({:error, %HTTPoison.Error{reason: reason}}) do
    {:error, 500, %{error: reason}}
  end

  defp match_response(_), do: {:error, 0, %{error: "unknown response"}}

  defp determine_headers(headers) do
    Enum.any?(headers, fn(x) -> x == {"Content-Type", "text/html"} end)
  end

  defp decode_request({:ok, valid}), do: valid
  defp decode_request({:error, _}), do: %{}
  defp decode_request({:error, _, _}), do: %{}

end
