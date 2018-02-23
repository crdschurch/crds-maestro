defmodule CrossroadsContent.PublicationsClient do
  @moduledoc """
  Handles getting all content from the CMS
  """
  use GenServer
  require Logger
  require IEx

  @base_url "http://localhost:5000/api"

  @spec get_articles() :: {:ok | :error, map}
  def get_articles() do
    GenServer.call(__MODULE__, {:articles}, 60000)
  end

  @spec get_articles(Integer, Integer) :: {:ok | :error, map}
  def get_articles(id, source) do
    GenServer.call(__MODULE__, {:articles, id, source}, 60000)
  end

  @doc false
  def start_link(opts \\ []) do
    GenServer.start_link(__MODULE__, :ok, opts)
  end

  @doc false
  def init(:ok) do
    {:ok, %{}}
  end

  @doc false
  def handle_call({:articles}, _from, state) do
    path = "/content/articles"
    make_call(path, state)
  end

  def handle_call({:articles, id, source}, _from, state) do
    path = "/content/articles/#{id}/#{source}"
    make_call(path, state)
  end

  @spec make_call(String.t, Map) :: {:reply, {:ok | :error, number(), any()}, map()}
  defp make_call(path, state) do
    IEx.pry
    result =
      "#{@base_url}#{path}"
      |> HTTPoison.get(%{"Accept" => "application/json"})
      |> match_response

    IEx.pry
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
    case Enum.filter(headers, &is_html/1) do
      [] -> false
      _  -> true
    end
  end

  defp is_html({"Content-Type", "text/html"}), do: true
  defp is_html(_header), do: false

  defp decode_request({:ok, valid}), do: valid
  defp decode_request({:error, _}), do: %{}

end
