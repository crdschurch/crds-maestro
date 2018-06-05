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
    plug CrossroadsInterface.Plug.FredApiUrl
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  # NOTE: If you add a route here make sure you add it in the legacy_controller file in the maestro-pages cookie
  scope "/", CrossroadsInterface do
    pipe_through :browser
    get "/podcasts/too-long-didnt-read/episode-1-ehud-and-the-fat-king/", Redirect, external: "https://media.crossroads.net/podcasts/too-long-didnt-read/ehud-and-the-fat-king"
    get "/podcasts/too-long-didnt-read/episode-2-judah-and-the-lyin/", Redirect, external: "https://media.crossroads.net/podcasts/too-long-didnt-read/judah-and-the-lyin"
    get "/podcasts/too-long-didnt-read/episode-3-boy-band-breakups/", Redirect, external: "https://media.crossroads.net/podcasts/too-long-didnt-read/boy-band-breakups"
    get "/podcasts/too-long-didnt-read/episode-4-balaams-talking-donkey/", Redirect, external: "https://media.crossroads.net/podcasts/too-long-didnt-read/balaams-talking-donkey"
    get "/podcasts/too-long-didnt-read/episode-5-its-the-end-of-the-world-as-we-know-it/", Redirect, external: "https://media.crossroads.net/podcasts/too-long-didnt-read/its-the-end-of-the-world-as-we-know-it"
    get "/podcasts/too-long-didnt-read/", Redirect, external: "https://media.crossroads.net/podcasts/too-long-didnt-read"

    get "/podcasts/ikr/bonus-episode-1-reflections-from-mid-season/", Redirect, external: "https://media.crossroads.net/podcasts/ikr/reflections-from-mid-season"
    get "/podcasts/ikr/episode-10-the-one-about-your-questions-and-royalty/", Redirect, external: "https://media.crossroads.net/podcasts/ikr/the-one-about-your-questions-and-royalty"
    get "/podcasts/ikr/episode-9-the-one-about-loss-and-poop/", Redirect, external: "https://media.crossroads.net/podcasts/ikr/the-one-about-loss-and-poop"
    get "/podcasts/ikr/episode-8-the-one-about-woman-camp-and-wipes/", Redirect, external: "https://media.crossroads.net/podcasts/ikr/the-one-about-woman-camp-and-wipes"
    get "/podcasts/ikr/episode-7-the-one-about-bro-culture-and-motorcycles/", Redirect, external: "https://media.crossroads.net/podcasts/ikr/the-one-about-bro-culture-and-motorcycles"
    get "/podcasts/ikr/episode-6-the-one-about-courage-and-calculus/", Redirect, external: "https://media.crossroads.net/podcasts/ikr/the-one-about-courage-and-calculus"
    get "/podcasts/ikr/episode-5-the-one-about-the-people-we-love-and-hair-shows/", Redirect, external: "https://media.crossroads.net/podcasts/ikr/the-one-about-the-people-we-love-and-hair-shows"
    get "/podcasts/ikr/episode-4-the-one-about-rest-and-janet-jackson/", Redirect, external: "https://media.crossroads.net/podcasts/ikr/the-one-about-rest-and-janet-jackson"
    get "/podcasts/ikr/episode-3-the-one-about-work-kids-and-weiner-dogs/", Redirect, external: "https://media.crossroads.net/podcasts/ikr/the-one-about-work-kids-and-weiner-dogs"
    get "/podcasts/ikr/episode-2-the-one-about-body-image-and-boobs/", Redirect, external: "https://media.crossroads.net/podcasts/ikr/the-one-about-body-image-and-boobs"
    get "/podcasts/ikr/episode-1-the-one-about-your-past-and-drug-dealing/", Redirect, external: "https://media.crossroads.net/podcasts/ikr/the-one-about-your-past-and-drug-dealing"
    get "/podcasts/ikr/episode-0-the-one-about-us-and-text-abbreviations/", Redirect, external: "https://media.crossroads.net/podcasts/ikr/the-one-about-us-and-text-abbreviations"
    get "/podcasts/ikr/", Redirect, external: "https://media.crossroads.net/podcasts/ikr"

    get "/podcasts/messages", Redirect, external: "https://media.crossroads.net/podcasts/messages"
    get "/podcasts/kids-club", Redirect, external: "https://media.crossroads.net/podcasts/kids-club"

    get "/group-leader/*path", CrdsGroupLeaderController, :index
    get "/connect/*path", CrdsConnectController, :index
    get "/groups/search/*path", CrdsGroupsController, :index
    get "/srfp/*path", CrdsSrfpController, :index
    get "/series/:id/*path", CmsSeriesController, :show
    get "/publications/articles/:id", PublicationsController, :show_article
    get "/publications/articles", PublicationsController, :index_articles
    get "/notfound", NotfoundController, :notfound
    get "/homepage", HomepageController, :index
    get "/explore", DynamicController, :index
    get "/atriumevents", DynamicController, :index
    get "/*path", LegacyController, :index
  end

end
