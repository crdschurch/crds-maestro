defmodule CrossroadsInterface.PublicationsView do
  use CrossroadsInterface.Web, :view

  def get_article_hero(content) do
    get_in(content, ["heroImg", "source"])
  end

  def get_article_hero_caption(content) do
    get_in(content, ["heroImg", "caption"])
  end

  def get_most_recent(articles) do
    reversed_articles = Enum.reverse(articles)
    Enum.take(reversed_articles, 1)
  end

  def get_featured(articles) do
    reversed_articles = Enum.reverse(articles)
    Enum.slice(reversed_articles, 2..7)
  end

  def get_unfeatured(articles) do
    reversed_articles = Enum.reverse(articles)
    split = Enum.split(reversed_articles, 8)
    |> Tuple.to_list()
    [head | tail] = split
    [head2 | tail2] = tail
    head2
  end
end
