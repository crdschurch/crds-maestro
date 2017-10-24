defmodule CrossroadsInterface.CmsPageView do
  use CrossroadsInterface.Web, :view

  require Logger

  def show_html(payload) do
    payload
    |> Floki.find(".fred-form")
    |> Floki.attribute("id")
    |> List.first
    |> grab_fred_data
    |> inject_into_body(payload)
    |> Floki.raw_html
    |> raw
  end

  defp inject_into_body(nil, payload), do: Floki.parse payload
  defp inject_into_body(to_inject, payload) do
    tree = payload |> Floki.parse
    IO.inspect tree
    transform(tree, to_inject)
  end

  defp transform([el, rest], to_inject) do
    Logger.debug "got a list of elements"
    new = transform(el, to_inject)
    newer = transform(rest, to_inject)
    [new, newer]
  end
  defp transform({el, attrs, rest}, to_inject) do
    Logger.debug "got a three tuple"
    cond do
      is_fred_div?(attrs) -> Floki.parse(to_inject)
      Enum.empty?(rest) -> {el, attrs, rest}
      true -> {el, attrs, transform(rest, to_inject)}
    end
  end
  defp transform({el, attrs}, to_inject) do
    Logger.debug "got a two tuple"
    {el, attrs}
  end
  defp transform(unknown, to_inject) do
    Logger.error "get an unmatched element"
    unknown
  end

  defp is_fred_div?(attrs) do
    res =
      attrs
      |> Enum.filter(fn({attr_name, attr_val}) -> attr_name == "class" && attr_val == "fred-form" end)
      |> Enum.empty?
    !res
  end

  defp grab_fred_data(nil), do: nil
  defp grab_fred_data(form_id) do
    path = "https://embedint.crossroads.net/fred/#{form_id}"
    Logger.debug("getting #{path}")
    HTTPoison.get("https://embedint.crossroads.net/fred/#{form_id}", %{}, hackney: [cookie: ["userId=2186211"]])
    |> case do
      {:ok, %HTTPoison.Response{ status_code: 200, body: body }} -> body
      {:ok, %HTTPoison.Response{ status_code: code, body: body }} -> ""
      {:error, %HTTPoison.Error{ reason: reason }} -> ""
    end
  end
end
