defmodule CrossroadsInterface.CmsViewTest do
  use CrossroadsInterface.ConnCase, async: true
  import Mock

  def with_session(conn) do
    session_opts = Plug.Session.init(store: :cookie, key: "_app",
                                     encryption_salt: "abc", signing_salt: "abc")
    conn()
    |> Map.put(:secret_key_base, String.duplicate("abcdefgh", 8))
    |> Plug.Session.call(session_opts)
    |> Plug.Conn.fetch_session()
    |> Plug.Conn.fetch_query_params()
  end

  @payload "<p> <div class='fred-content' id='profile'> </div> </p>"
  @good_fred_form %{form_id: "profile", redirect_url: "https://google.com"}
  @good_form_response "<div id='formio'> this is the form </div>"
  @injected "<p><div id='formio'> this is the form </div></p>"
  @contact_id "2999"

  test "injects fred form", %{conn: conn} do
    with_mocks([
      {FredContent, [], [get_form_info: fn(_path, @payload) -> @good_fred_form end]},
      {FredContent, [], [fetch_form: fn("profile", @contact_id, "https://google.com") -> @good_form_response end]},
      {FredContent, [], [inject_form: fn(@good_form_response, @payload) -> @injected end]}
    ]) do
      conn =
        conn
        |> with_session
        |> Map.put(:req_cookies, %{"intsessionId" => "1234"})
        |> Map.put(:req_cookies, %{"userId" => @contact_id})
      view = CrossroadsInterface.CmsPageView.show_html(conn, @payload)
      assert view == {:safe, @injected}
     end
  end

  test "skips fetching if no fred class", %{conn: conn} do
    with_mocks([
      {FredContent, [], [get_form_info: fn(_path, @payload) -> nil end]},
    ]) do
      conn =
        conn
        |> with_session
        |> Map.put(:req_cookies, %{"intsessionId" => "1234"})
        |> Map.put(:req_cookies, %{"userId" => @contact_id})
      view = CrossroadsInterface.CmsPageView.show_html(conn, @payload)
      assert view == {:safe, @payload}
     end
  end
end
