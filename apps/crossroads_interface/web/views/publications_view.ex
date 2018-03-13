defmodule CrossroadsInterface.PublicationsView do
  use CrossroadsInterface.Web, :view

  def get_article_hero(content) do
    get_in(content, ["heroImg", "source"])
  end

  def get_article_hero_caption(content) do
    get_in(content, ["heroImg", "caption"])
  end

  def convert_date_string(date_string) do
    {:ok, parsed_date} = Timex.parse(date_string, "{ISO:Extended}")
    {:ok, formatted_date} = Timex.format(parsed_date, "%b %d, %Y", :strftime)
    formatted_date
  end

  def get_most_recent(articles) do
    Enum.take(articles, 1)
  end

  def get_featured(articles) do
    Enum.slice(articles, 2..7)
  end

  def get_unfeatured(articles) do
    split = Enum.split(articles, 1)
    |> Tuple.to_list()
    [head | tail] = split
    [head2 | tail2] = tail
    head2
  end
end
