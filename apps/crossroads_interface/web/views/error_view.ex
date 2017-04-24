defmodule CrossroadsInterface.ErrorView do
  use CrossroadsInterface.Web, :view
  require IEx

  def render("404.html", assigns) do
    "404"
  end

  def render("500.html", assigns) do
    render("500", assigns)
  end

  # In case no render clause matches or no
  # template is found, let's render it as 500
  def template_not_found(_template, assigns) do
    render "404.html", assigns
  end
end
