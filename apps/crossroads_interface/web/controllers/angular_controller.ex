defmodule CrossroadsInterface.AngularController do
  use CrossroadsInterface.Web, :controller

  def index(conn, _params) do
    render conn, "index.html", %{ "js_files": [ 
        "/js/angular2-webpack/polyfills.dll.js",
        "/js/angular2-webpack/vendor.dll.js",
        "/js/angular2-webpack/polyfills.bundle.js",
        "/js/angular2-webpack/vendor.bundle.js",
        "/js/angular2-webpack/main.bundle.js",
      ] }
  end
end
