defmodule CrossroadsInterface.ProxyContentController do
  use CrossroadsInterface.Web, :controller
  @moduledoc """
  Handles all aspects of proxying to the CMS
  """
  require IEx

  @doc """
  Handle when a request comes in for a specific page in the CMS
  """
  def handle_content_proxy(%{:request_path => _request_path} = conn, %{"link" => page} = _params) do
    {_, code, body} = CrossroadsContent.Pages.get_page(page, false)
    conn |> send_response(code, Poison.encode(body))
  end

  @doc """
  Handle when a request comes in for content blocks
  """
  def handle_content_proxy(%{:request_path => "/proxy/content//api/ContentBlock"} = conn, _params) do
    {_, code, body} =  CrossroadsContent.Pages.get_content_blocks()
    conn |> send_response(code, Poison.encode(body))
  end

  @doc """
  Handle when a request for the site config comes in
  """
  def handle_content_proxy(%{:request_path => "/proxy/content//api/SiteConfig/" <> site_id} = conn, _params) do
    {_, code, body} = CrossroadsContent.Pages.get_site_config(site_id)
    conn |> send_response(code, Poison.encode(body))
  end

  @doc """
  Handle when a SystemPage is requested
  """
  def handle_content_proxy(%{:request_path => "/proxy/content//api/SystemPage/"} = conn, %{"StateName" => state_name} = _params) do
    {_, code, body} = CrossroadsContent.Pages.get_system_page(state_name)
    conn |> send_response(code, Poison.encode(body))
  end

  @doc """
  Handle any other CMS requests by 
  """
  def handle_content_proxy(%{:request_path => "/proxy/content//api/" <> request_path} = conn, params) do
    {_, code, body} = CrossroadsContent.Pages.get(request_path, params)
    conn |> send_response(code, Poison.encode(body))
  end

  @doc """
  Handle any other CMS requests by 
  """
  def handle_content_proxy(%{:request_path => "/proxy/content/api/" <> request_path} = conn, params) do
    {_, code, body} = CrossroadsContent.Pages.get(request_path, params)
    conn |> send_response(code, Poison.encode(body))
  end

  def send_response(conn, code, {:ok, data} = _body) do
  conn
    |> put_resp_content_type("application/json")
    |> send_resp(code, data)
  end

  def send_response(conn, code, {:error, _data} = _body) do
  conn
    |> put_resp_content_type("application/json")
    |> send_resp(code, "{\"pages\": []}") #TODO: what to send when encoding fails?
  end

end
