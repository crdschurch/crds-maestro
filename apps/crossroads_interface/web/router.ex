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

 # scope "/proxy/gateway", CrossroadsInterface do
    #pipe_through :api
    #get "/*gateway", ProxyGatewayController, :handle_gateway_proxy
    #put "/*gateway", ProxyGatewayController, :handle_gateway_proxy
    #post "/*gateway", ProxyGatewayController, :handle_gateway_proxy
  #end

  #scope "/proxy/content", CrossroadsInterface do
    #pipe_through :api
    #get "/*content", ProxyContentController, :handle_content_proxy
    #post "/*content", ProxyContentController, :handle_content_proxy
    #put "/*content", ProxyContentController, :handle_content_proxy
  #end

  scope "/group-leader", CrossroadsInterface do
    pipe_through :browser
    get "/*path", CrdsGroupLeaderController, :index
  end

  scope "/connect", CrossroadsInterface do
    pipe_through :browser
    get "/*path", CrdsConnectController, :index
  end

  scope "/", CrossroadsInterface do
    pipe_through :browser
    get "/notfound", NotfoundController, :notfound
    get "/signout", LegacyController, :noRedirect
    get "/signin", LegacyController, :noRedirect
    get "/register", LegacyController, :noRedirect
    get "/homepage", HomepageController, :index
    get "/*path", LegacyController, :index
  end

end
