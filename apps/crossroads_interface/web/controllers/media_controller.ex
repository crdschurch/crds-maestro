defmodule CrossroadsInterface.MediaController do
  use CrossroadsInterface.Web, :controller
  alias CrossroadsContent.Pages
  alias CrossroadsInterface.Plug

  plug Plug.Meta
  plug Plug.ContentBlocks
  plug Plug.BodyClass, "crds-legacy-styles"

  plug :put_layout, "screen_width.html"

  def index(conn, _params) do
    seriesMap = Media.series_all_active()

    [series1 | seriesTail] = seriesMap
    [series | _tail ] = seriesTail


    imgPath = series["image"]["filename"]
    seriesTitle = series["title"]
    seriesDate = series["startDate"]

    ul = "<ul class='media-list'>"
    listItem = "<li class='col-sm-2 col-xs-g ng-scope'>"
    anchorTag = "<a href='#'>"
    imgLink = "<div class='sixteen-nine overflow-hidden'><div class='aspect-content'><img data-src='#{imgPath}' src='#{imgPath}' class='img-responsiive imgix-fluid center img-full-width' /></div></div>"
    seriesTitleElt = "<h5 class='flush-bottom ellipsis ng-binding'>#{seriesTitle}</h5>"
    seriesDateElt = "<p class='text-muted ng-binding'>#{seriesDate}</p>"
    closeTags="</a></li></ul>"

    payload = ul <> listItem <> anchorTag <> imgLink <> seriesTitleElt <> seriesDateElt <> closeTags
    
   
    conn
    |> render("media.html", %{ payload: payload,
      "css_files": [
      "/js/legacy/legacy.css"
      ]
    })
  end

    #flatMap = flatten(series);
    #title = Lens.make_lens(:title)
    #startDate = Lens.make_lens(:startDate)
    #id = Lens.make_lens(:id)
    #image = Lens.make_lens(:image)
    #imgPath = Lens.make_lens(:filename)

    # id = flatMap["id"]
    # imgPath = flatMap["image.filename"]
    # seriesTitle = flatMap["title"]
    # seriesDate = flatMap["startDate"]

  def flatten(map) when is_map(map) do
    map
    |> to_list_of_tuples
    |> Enum.into(%{})
  end
  

  defp to_list_of_tuples(m) do
    m
    |> Enum.map(&process/1)
    |> List.flatten
  end

  defp process({key, sub_map}) when is_map(sub_map) do
    IO.inspect("key = " <> key)
    for { sub_key, value } <- sub_map do
      { 
          process({join(key, sub_key), value})
      }
    end
  end

  defp join(a, b) do
    to_string(a) <> "." <> to_string(b)
  end

end
