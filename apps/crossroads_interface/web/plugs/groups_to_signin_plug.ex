defmodule CrossroadsInterface.Plug.GroupsToSignin do
  @moduledoc """
  # This plug is used for Finder Groups
  # we need the referring url to be set in the cookies on sign in 
  # so that when the user is redirected back to groups from sign in 
  # they are taken back to where they were and not shown the onboarding 
  # page again.  Onoarding will not show again if there is a '?'(a query parameter)
  # so if it does not come in with one, it adds '?showOnboarding=false'-- all that
  # really matters is the '?' in the URL thouugh. showOnboarding=false is just an
  # arbitrary parameter with no significance in groups.
  """
  import Plug.Conn

  def init(default), do: default

  def call(conn) do
    case checkIfTargetingSignin(conn) do
      true -> addReferringCookieIfFromGroups(conn)
      false -> conn
    end
  end

  defp checkIfTargetingSignin(conn) do
    conn.request_path =~ "/signin"
  end

  defp addReferringCookieIfFromGroups(conn) do
    case List.keyfind(conn.req_headers, "referer", 0) do
      {"referer", referer} -> addGroupsReferringCookie(referer, conn)
      nil -> conn
    end
  end

  defp addGroupsReferringCookie(referer, conn) do
    case (referer =~ "/groups/search") do
      true -> CrossroadsInterface.Plug.RedirectCookie.call(conn, handleShowOnboardingParam(referer))
      false -> conn
    end
  end

  defp handleShowOnboardingParam(referer) do
    case (referer =~ "?") do
      true -> referer
      false -> "#{referer}?showOnboarding=false"
    end
  end
end
