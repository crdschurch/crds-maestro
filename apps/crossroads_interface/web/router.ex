defmodule CrossroadsInterface.Router do
  use CrossroadsInterface.Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug CrossroadsInterface.Plug.PageType
    plug CrossroadsInterface.Plug.Payload
    plug CrossroadsInterface.Plug.BaseHref
    plug CrossroadsInterface.Plug.PutMetaTemplate
    plug CrossroadsInterface.Plug.BodyClass
    plug CrossroadsInterface.Plug.CrdsStyles
    plug CrossroadsInterface.Plug.EmbedUrl
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", CrossroadsInterface do
    pipe_through :browser
    get "/group-leader/*path", CrdsGroupLeaderController, :index
    get "/connect/*path", CrdsConnectController, :index
    get "/groups/search/*path", CrdsGroupsController, :index
    get "/srfp/*path", CrdsSrfpController, :index
    get "/series/:id/*path", CmsSeriesController, :show
    get "/publications/:medium/:id/*path", PublicationsController, :show
    get "/publications/:medium", PublicationsController, :index
    get "/publications/", PublicationsController, :index

    get "/notfound", NotfoundController, :notfound
    get "/homepage", HomepageController, :index
    get "/explore", DynamicController, :index
    get "/atriumevents", DynamicController, :index
    get "/*path", LegacyController, :index
  end

end
