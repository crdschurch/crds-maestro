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

    _tail
    |> IO.inspect()

    items = Map.to_list(series)
    #|> IO.inspect()

    #List.last(items)
    #|> IO.inspect()

    Enum.each items, fn({_, val})  ->
        "#{val}"
        |> IO.inspect()
    end

    #for n <- seriesList, do: seriesList[n]

    conn
    |> render("media.html", %{ payload: items,
      "css_files": [
      "/js/legacy/legacy.css"
      ]
    })
  end
#for n <- [0 .. Enum.count(body["series"])], do: "<p>" <> Enum.at(body["series"],n)["title"] <> "</p>"
    #length(payload)
    #|> IO.inspect()

     #payload = Enum.filter(seriesList, fn h -> h != nil end)
    
   #payload = Enum.at(seriesList["Series"],0)["title"]
   # payload = List.count(seriesList)
    #payload = "Hi there "
    #Enum.at(seriesList[:series],0)["title"]
    #payload = seriesList[":series"]["title"]
        #seriesList
    #|> IO.inspect()
end
