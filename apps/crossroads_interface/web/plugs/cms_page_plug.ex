defmodule CrossroadsInterface.Plug.CmsPage do
    @moduledoc """
    Get all required and optional META tag properties from the CMS
    and supply them to the template.
    """
    import Plug.Conn
    alias CrossroadsContent.Pages

    def init(default), do: default
  
    def call(conn, _default) do
      path = conn.request_path |> ContentHelpers.add_trailing_slash_if_necessary
      case Pages.get_page(determine_authorized_path(conn, path),
                                            ContentHelpers.is_stage_request?(conn.params)) do      
        {:ok, page}
          -> conn
            |> assign(:path, path)
            |> assign(:page, page)
        _
          -> conn
      end
    end

    def determine_authorized_path(conn, path) do
      case path do
        "/" -> return_root_by_authentication_status(conn)
        _ -> path
      end
    end

    def return_root_by_authentication_status(conn) do
      case conn.assigns[:authorized] do
        true -> "/personalized/"
        false -> "/"
        _ -> "/"
      end
    end
  
  end
  
