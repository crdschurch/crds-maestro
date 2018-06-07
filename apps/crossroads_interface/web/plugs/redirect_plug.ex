defmodule CrossroadsInterface.Redirect do
  import Plug.Conn

  @spec init(Keyword.t) :: Keyword.t
  def init(default), do: default

  @spec call(Plug.Conn.t, Keyword.t) :: Plug.Conn.t
  def call(conn, opts) do
    conn
    |> put_status(:moved_permanently)
    |> Phoenix.Controller.redirect(opts)
    |> halt()
  end
end
