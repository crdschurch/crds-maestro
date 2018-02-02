defmodule CrossroadsContent.ContentClient do
    @moduledoc """
    Handles getting all content from the CMS
    """
    use GenServer
    require Logger
    require IEx
  
    @base_url Application.get_env(:crossroads_content, :content_microservice_endpoint)
    @timeout Application.get_env(:crossroads_content, :cms_timeout)
     
    @spec get_article(String.t) :: {:ok | :error, number, map}
    def get_article(name) do
      GenServer.call(__MODULE__, {:article, name}, @timeout)
    end

    @spec get_articles() :: {:ok | :error, number, map}
    def get_articles() do
      GenServer.call(__MODULE__, {:articles}, @timeout)
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
    def handle_call({:article, name}, _from, state) do
      path = "content/article/#{name}"
      make_cached_call(path, state)
    end
  
    @doc false
    def handle_call({:articles}, _from, state) do
      path = "content/articles"
      make_cached_call(path, state)
    end
  
    defp make_cached_call(path, state) do
      {status, result} = Cachex.get(:cms_cache, path)
      res =
        if status == :missing do
          {:reply, new_result, _state} = make_call(path, state)
          if elem(new_result, 0) == :ok do
            Cachex.set(:cms_cache, path, new_result)
          end
          new_result
        else
          result
        end
      {:reply, res, state}
    end
  
    @spec make_call(String.t, map()) :: {:reply, {:ok | :error, number(), any()}, map()}
    defp make_call(path, state) do
        IEx.pry
      result =
        "#{@base_url}api/#{path}"
        |> HTTPoison.get(%{"Accept" => "application/json"}, recv_timeout: @timeout)
        |> match_response
      {:reply, result, state}
    end
  
    @spec match_response({:ok | :error, HTTPoison.Response.t}) :: {:ok | :error, number(), any()}
    defp match_response({:ok, %HTTPoison.Response{status_code: 404, body: body}}) do
      {:error, 404, decode_request(Poison.decode(body))}
    end
    defp match_response({:ok, %HTTPoison.Response{status_code: 200, body: body, headers: headers}}) do
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
  