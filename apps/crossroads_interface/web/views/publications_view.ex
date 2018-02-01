defmodule CrossroadsInterface.PublicationsView do
  use CrossroadsInterface.Web, :view

  def get_article_hero(content) do
    get_in(content, ["heroImg", "source"])
  end

  def get_article_hero_caption(content) do
    get_in(content, ["heroImg", "caption"])
  end

end
