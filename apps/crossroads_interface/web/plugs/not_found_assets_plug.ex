defmodule CrossroadsInterface.Plug.NotFoundAssetsPlug do
  @moduledoc """
  Bypass specific extensions
  """
  use Plug.Builder
  import Plug.Conn
  require Regex

  @regex_asset ~r/.*?(\.ico|\.eot|\.svg|\.js|\.css|\.xml|\.php|\.less|\.png|\.jpg|\.jpeg|\.gif|\.pdf|\.doc|\.txt|\.ico|\.rss|\.zip|\.mp3|\.rar|\.exe|\.wmv|\.doc|\.avi|\.ppt|\.mpg|\.mpeg|\.tif|\.wav|\.mov|\.psd|\.ai|\.xls|\.mp4|\.m4a|\.swf|\.dat|\.dmg|\.iso|\.flv|\.m4v|\.torrent|\.ttf|\.woff)/

  plug :return_not_found_if_not_found

  def init(default), do: default

  defp return_not_found_if_not_found(conn, _) do
    requested_asset = conn.request_path #Enum.at(conn.path_info, -1)
    is_match = Regex.match?(@regex_asset, requested_asset)
    if is_match do
      conn
      |> send_resp(404, "")
      |> halt
    else
      conn
    end
  end
end
