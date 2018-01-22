defmodule CrossroadsInterface.Plug.MediaMeta do
  @moduledoc """
  Get all required and optional META tag properties from the CMS
  and supply them to the template.
  """
  alias CrossroadsContent.CmsClient
  import Plug.Conn

  @default_image "http://crds-cms-uploads.imgix.net/content/images/cr-social-sharing-still-bg.jpg"
  @max_description_len 305

  def init(default), do: default

  def call(conn, media_object) do    
    site_config = 1
    |> CmsClient.get_site_config
    |> match_site_config

    conn
    |> assign(:meta_description, get_description(media_object))
    |> assign(:meta_title, get_title(media_object))
    |> assign(:meta_url, create_url(media_object))
    |> assign(:meta_type, "website")
    |> assign(:meta_image, get_image_file(media_object))
    |> assign(:meta_siteconfig_title, "Crossroads")
    |> assign(:meta_siteconfig_locale, Map.get(site_config, "locale", "en_US"))
    |> assign(:meta_siteconfig_facebook, Map.get(site_config, "facebook", ""))
    |> assign(:meta_siteconfig_twitter, Map.get(site_config, "twitter", ""))
  end

  defp get_description media do
    description = if media["description"], do: media["description"], else: ""
    {:safe, content} = PhoenixHtmlSanitizer.Helpers.strip_tags(description)
    content |> String.slice(0, @max_description_len - 1)
  end

  defp get_title media do
    title = if media["title"], do: media["title"], else: "Crossroads"
    "#{title} | Crossroads"
  end

  defp get_image_file media do
    if media["image"]["filename"], do: media["image"]["filename"], else: @default_image
  end

  defp create_url media do
    app_env = Application.get_env(:crossroads_interface, :cookie_domain)
    url_prefix =  if app_env != "", do: app_env, else: "www"
    resource = String.downcase(media["className"])

    "https://#{url_prefix}.crossroads.net/#{resource}/#{media["id"]}/#{linkify_title(media["title"])}"
  end

  defp linkify_title title do
    String.downcase(title)
    |> String.replace(" ", "-")
  end

  defp match_site_config({:ok, _resp_code, body}) do
    body
    |> Map.get("siteConfig", %{})
  end
  defp match_site_config(_), do: %{}
end
