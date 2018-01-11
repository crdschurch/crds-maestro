defmodule CrossroadsInterface.ArticlesView do
  use CrossroadsInterface.Web, :view

  def get_title_from_post(post) do
    {id, %{"title" => title}} = post
    title
  end

  def create_link(post) do
    {id, %{"title" => title}} = post
    String.downcase(title)
    |> remove_punctuation
    |> linkify_string
    |> add_id(id)
  end

  def remove_punctuation(string) do
    String.replace(string, ~r/[\p{P}\p{S}]/, "")
  end

  def linkify_string(string) do
    String.replace(string, " ", "-")
  end

  def add_id(title, id) do
    title <> "-" <> id
  end
end
