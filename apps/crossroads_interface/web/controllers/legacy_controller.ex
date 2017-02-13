defmodule CrossroadsInterface.LegacyController do
  use CrossroadsInterface.Web, :controller
  @moduledoc"""
  This controller is called from the fall through route in the router. 
  The purpose is to handle serving up the 'legacy' angular application using 
  the legacy template
  """

  plug :put_layout, "legacy.html"

  def index(conn, _params) do
    render conn, "index.html", %{ "js_files": [
        "/js/legacy/ang.js",
        "/js/legacy/core.js",
        "/js/legacy/common.js",
        "/js/legacy/profile.js",
        "/js/legacy/trips.js",
        "/js/legacy/camps.js",
        "/js/legacy/media.js",
        "/js/legacy/search.js",
        "/js/legacy/govolunteer.js",
        "/js/legacy/formbuilder.js",
        "/js/legacy/childcare.js",
        "/js/legacy/formlybuilder.js",
        "/js/legacy/main.js"
      ], "css_files": [
       "/css/main.css",
       "/js/legacy/core.css"
      ], "base_href": "/"}
  end
end
