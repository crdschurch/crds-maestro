defmodule CrossroadsInterface.CmsMessageController do
  use CrossroadsInterface.Web, :controller
  require Logger
  require IEx
  alias CrossroadsInterface.Plug
  alias CrossroadsContent.CmsClient
  alias CrossroadsInterface.NotfoundController

  plug Plug.Meta
  plug Plug.ContentBlocks
  plug Plug.BodyClass, "crds-styles"
  plug :put_layout, "screen_width.html"

  @base_url Application.get_env(:crossroads_content, :cms_server_endpoint)
  @timeout Application.get_env(:crossroads_content, :cms_timeout)

  def show(conn, %{"id" => id}) do
    message = CmsClient.get_message_by_id(id)
    case message do
      {:ok, _response_code, %{"message" => message}} ->
        render conn, "individual_message.html", %{message: message,
          css_files: [ "/css/app.css", "/js/legacy/legacy.css" ]}
      {:error, _response_code, response_data} ->
        Logger.error("Error getting message data from CMS")
        NotfoundController.notfound(conn, %{})
      _ ->
        Logger.error("Error getting message data from CMS")
        NotfoundController.notfound(conn, %{})
    end
  end
end
