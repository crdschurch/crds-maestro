defmodule CrossroadsInterface.Plug.Meta do
  @moduledoc """
  Get all required and optional META tag properties from the CMS
  and supply them to the template.
  """
  require IEx
  import Plug.Conn
  alias CrossroadsContent.CmsClient
  alias CrossroadsContent.Pages

  @default_image "http://crds-cms-uploads.imgix.net/content/images/cr-social-sharing-still-bg.jpg"
  @max_description_len 305

  def init(default), do: default

  def call(conn, _default) do

    page = case conn.request_path |> ContentHelpers.add_trailing_slash_if_necessary |> Pages.page_exists? do
      true -> conn.request_path 
                |> ContentHelpers.add_trailing_slash_if_necessary 
                |> Pages.get_page 
                |> match_page
      false -> conn.request_path 
                |> String.split("/") 
                |> Enum.filter(&(&1 != "")) 
                |> Enum.join(".") 
                |> CmsClient.get_system_page
                |> match_system_pages
    end

    site_config = 1
                  |> CmsClient.get_site_config
                  |> match_site_config

    conn
    |> assign(:meta_description, get_description(page))
    |> assign(:meta_title, get_title(page, site_config))
    |> assign(:meta_url, get_url(page))
    |> assign(:meta_type, Map.get(page, "type", "website"))
    |> assign(:meta_image, find_image(page))
    |> assign(:meta_card, Map.get(page, "card", ""))
    |> assign(:meta_siteconfig_title, Map.get(site_config, "title", "Crossroads"))
    |> assign(:meta_siteconfig_locale, Map.get(site_config, "locale", "en_US"))
    |> assign(:meta_siteconfig_facebook, Map.get(site_config, "facebook", ""))
    |> assign(:meta_siteconfig_twitter, Map.get(site_config, "twitter", ""))
  end

  defp get_title(page, site_config) do
   page_title = Map.get(page, "title", "Crossroads")
   title_suffix = " | " <> Map.get(site_config, "title", "Crossroads")
   case String.contains?(page_title, title_suffix) do
     true -> page_title
     false -> page_title <> title_suffix
   end
  end

  defp get_url(%{"uRL" => url}) do
    url
  end

  defp get_url(%{"uRLSegment" => url_segment}) do
    "/" <> url_segment
  end

  defp get_url(_) do
    ""
  end

  defp get_description(%{"description" => description}) do
    description
  end

  defp get_description(%{"metaDescription" => description, "content" => content}) do
    case description do
      nil -> {:safe, content} = PhoenixHtmlSanitizer.Helpers.strip_tags(content) 
        content |> String.slice(0, @max_description_len - 1)
      _ -> description
    end
  end

  defp get_description(_) do
    ""
  end

  defp find_image(%{"image" => image}) do
    Map.get(image, "filename", @default_image)
  end

  defp find_image(_) do
    @default_image
  end

  defp match_system_pages({:ok, resp_code, body}) do
    list = body |> Map.get("systemPages", [])
    if Enum.count(list) > 0 do
      List.first(list)
    else 
      %{}
    end
  end

  defp match_system_pages({:error, resp_code, body}) do
    %{}
  end

  defp match_site_config({:ok, resp_code, body}) do
    body
    |> Map.get("siteConfig", %{})
  end

  defp match_site_config({:ok, resp_code, body}) do
    %{}
  end

  defp match_page(response) do
    case response do
      :error -> %{}
      {:ok, page} -> page
    end    
  end
end
