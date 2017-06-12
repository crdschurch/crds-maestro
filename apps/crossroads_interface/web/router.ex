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
    plug CrossroadsInterface.Plug.CrdsStyles
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", CrossroadsInterface do
    pipe_through :browser
    get "/group-leader/*path", CrdsGroupLeaderController, :index
    get "/connect/*path", CrdsConnectController, :index
    get "/groupsv2/*path", CrdsGroupsController, :index
    get "/streaming/*path", CrdsStreamingController, :index
    get "/notfound", NotfoundController, :notfound
    get "/signout", LegacyController, :noRedirect
    get "/signin", LegacyController, :noRedirect
    get "/register", LegacyController, :noRedirect
    get "/homepage", HomepageController, :index
    get "/*path", LegacyController, :index
  end

end
