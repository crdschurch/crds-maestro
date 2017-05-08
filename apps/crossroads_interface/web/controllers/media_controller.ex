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

    [series | _tail] = seriesMap

    flatMap = flatten(series);
    id = flatMap["id"]
    imgPath = flatMap["image.filename"]
    seriesTitle = flatMap["title"]
    seriesDate = flatMap["startDate"]

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

    def flatten(map) when is_map(map) do
    map
    |> to_list_of_tuples
    |> Enum.into(%{})
    |> IO.inspect()
  end

  defp to_list_of_tuples(m) do
    m
    |> Enum.map(&process/1)
    |> List.flatten
    |> IO.inspect()
  end

  defp process({key, sub_map}) when is_map(sub_map) do
    for { sub_key, value } <- sub_map do
      { join(key, sub_key), value }
    end
  end

  defp process({key, value}) do
    { key, value }
  end

  defp join(a, b) do
    to_string(a) <> "." <> to_string(b)
  end
#for n <- [0 .. Enum.count(body["series"])], do: "<p>" <> Enum.at(body["series"],n)["title"] <> "</p>"
    #length(payload)
    #|> IO.inspect()

     #payload = Enum.filter(seriesList, fn h -> h != nil end)
   #      |> IO.inspect("#{k} => #{v}")
 
   #payload = Enum.at(seriesList["Series"],0)["title"]
   # payload = List.count(seriesList)
    #payload = "Hi there "
    #Enum.at(seriesList[:series],0)["title"]
    #payload = seriesList[":series"]["title"]
        #seriesList
    #|> IO.inspect()
        #"End for loop"
    #|> IO.inspect()

    #_tail
    #|> IO.inspect()

    #payload = Map.to_list(series)
    #|> IO.inspect()

    #List.last(items)
    #|> IO.inspect()

    #Enum.each items, fn({_, val})  ->
        #"#{val}"
        #|> IO.inspect()
    #end

    #for n <- seriesList, do: seriesList[n]

    
    #"Begin for loop"
    #|> IO.inspect()
end
