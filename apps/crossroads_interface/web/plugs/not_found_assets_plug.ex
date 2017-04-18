defmodule CrossroadsInterface.Plug.NotFoundAssetsPlug do
  use Plug.Builder
  import Plug.Conn
  require IEx
  require Logger
  require Regex

  @regex_asset ~r/.*?(\.ico|\.eot|\.svg|\.js|\.css|\.xml|\.less|\.png|\.jpg|\.jpeg|\.gif|\.pdf|\.doc|\.txt|\.ico|\.rss|\.zip|\.mp3|\.rar|\.exe|\.wmv|\.doc|\.avi|\.ppt|\.mpg|\.mpeg|\.tif|\.wav|\.mov|\.psd|\.ai|\.xls|\.mp4|\.m4a|\.swf|\.dat|\.dmg|\.iso|\.flv|\.m4v|\.torrent|\.ttf|\.woff)/

  plug :return_not_found_if_not_found

  def return_not_found_if_not_found(conn, _) do
    requested_asset = Enum.at(conn.path_info, -1)
    is_match = Regex.match?(@regex_asset, requested_asset)
    if (is_match) do
      Logger.debug("sending not found")
      send_resp(conn, 404, "")
      |> halt
    end
    conn
  end
end