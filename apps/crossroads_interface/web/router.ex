defmodule CrossroadsInterface.Router do
  use CrossroadsInterface.Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
    plug CrossroadsInterface.Plug.PageType
    plug CrossroadsInterface.Plug.Payload
    plug CrossroadsInterface.Plug.BaseHref
    plug CrossroadsInterface.Plug.PutMetaTemplate
    plug CrossroadsInterface.Plug.Authorized
    plug CrossroadsInterface.Plug.BodyClass
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

 # scope "/proxy", CrossroadsInterface do
    #pipe_through :api
    #forward "/gateway", ProxyGatewayController, :handle_gateway_proxy
    #forward "/content", ProxyContentController, :handle_content_proxy
  #end

  scope "/", CrossroadsInterface do
    pipe_through :browser

    forward "/group-leader", CrdsGroupLeaderController, :index
    forward "/connect", CrdsConnectController, :index
    get "/notfound", NotfoundController, :notfound
    get "/signout", LegacyController, :noRedirect
    get "/signin", LegacyController, :noRedirect
    get "/register", LegacyController, :noRedirect
    get "/homepage", HomepageController, :index
    forward "/", LegacyController, :index
  end

end
