defmodule CrossroadsInterface.FoobarControllerTest do
  use CrossroadsInterface.ConnCase

  alias CrossroadsInterface.Foobar
  @valid_attrs %{}
  @invalid_attrs %{}

  test "lists all entries on index", %{conn: conn} do
    conn = get conn, foobar_path(conn, :index)
    assert html_response(conn, 200) =~ "Listing foobars"
  end

  test "renders form for new resources", %{conn: conn} do
    conn = get conn, foobar_path(conn, :new)
    assert html_response(conn, 200) =~ "New foobar"
  end

  test "creates resource and redirects when data is valid", %{conn: conn} do
    conn = post conn, foobar_path(conn, :create), foobar: @valid_attrs
    assert redirected_to(conn) == foobar_path(conn, :index)
    assert Repo.get_by(Foobar, @valid_attrs)
  end

  test "does not create resource and renders errors when data is invalid", %{conn: conn} do
    conn = post conn, foobar_path(conn, :create), foobar: @invalid_attrs
    assert html_response(conn, 200) =~ "New foobar"
  end

  test "shows chosen resource", %{conn: conn} do
    foobar = Repo.insert! %Foobar{}
    conn = get conn, foobar_path(conn, :show, foobar)
    assert html_response(conn, 200) =~ "Show foobar"
  end

  test "renders page not found when id is nonexistent", %{conn: conn} do
    assert_error_sent 404, fn ->
      get conn, foobar_path(conn, :show, -1)
    end
  end

  test "renders form for editing chosen resource", %{conn: conn} do
    foobar = Repo.insert! %Foobar{}
    conn = get conn, foobar_path(conn, :edit, foobar)
    assert html_response(conn, 200) =~ "Edit foobar"
  end

  test "updates chosen resource and redirects when data is valid", %{conn: conn} do
    foobar = Repo.insert! %Foobar{}
    conn = put conn, foobar_path(conn, :update, foobar), foobar: @valid_attrs
    assert redirected_to(conn) == foobar_path(conn, :show, foobar)
    assert Repo.get_by(Foobar, @valid_attrs)
  end

  test "does not update chosen resource and renders errors when data is invalid", %{conn: conn} do
    foobar = Repo.insert! %Foobar{}
    conn = put conn, foobar_path(conn, :update, foobar), foobar: @invalid_attrs
    assert html_response(conn, 200) =~ "Edit foobar"
  end

  test "deletes chosen resource", %{conn: conn} do
    foobar = Repo.insert! %Foobar{}
    conn = delete conn, foobar_path(conn, :delete, foobar)
    assert redirected_to(conn) == foobar_path(conn, :index)
    refute Repo.get(Foobar, foobar.id)
  end
end
