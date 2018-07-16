# Microclients Served By Maestro

- `/group-leader`: [Group Leader Application](https://github.com/crdschurch/group-leader-application)
- `/finder`: [Connect](https://github.com/crdschurch/crds-connect)
- `/groups`: [Connect](https://github.com/crdschurch/crds-connect)
- `/srfp`: [SRFP Assessment](https://github.com/crdschurch/srfp-assessment)

# How to set up a Microclient in Maestro for local development

For local development of a Microclient within Maestro, a few steps are necessary to
complete to get it up and running.

1. Build the project that is going to be a microclient. This should result in some
   kind of `build` or `assets` directory that contains all the compiled assets that
   are necessary for the project to run as a standalone application.
2. Navigate within the Maestro project to the
   `/apps/crossroads_interface/web/static/js` directory.
3. In this directory, create a
   [symlink](http://lmgtfy.com/?q=how+to+create+a+symlink+in+mac+and+windows)
   directory that has a sensible name that identifies it with the Microclient project
   you are setting up in Maestro. An example of this might look like:
   `ln -s /crds/projects/crds-angular/crossroads.net/assets ./crds-angular`
4. Register a new route in the `/apps/crossroads_interface/web/router.ex` file. A
   specific example of this is:

   ```elixir
   get "/group-leader/*path", CrdsGroupLeaderController, :index
   ```
5. Create a new controller in the `/apps/crossroads_interface/web/controller/`
   directory. Continuing the above example:

   ```elixir
   defmodule CrossroadsInterface.CrdsGroupLeaderController do
     use CrossroadsInterface.Web, :controller

     def index(conn, _params) do
       conn
       |> render("app_root.html", %{"js_files": [
           "/js/group_leader/inline.bundle.js",
           "/js/group_leader/polyfills.bundle.js",
           "/js/group_leader/styles.bundle.js",
           "/js/group_leader/vendor.bundle.js",
           "/js/group_leader/main.bundle.js"
         ], "css_files": [ 
           "/css/app.css",
           "/js/legacy/legacy.css",
           "/js/group_leader/styles.bundle.css" 
         ]})
     end

   end
   ```
6. Create a new view in the `/apps/crossroads_interface/web/views/` directory.
   Continuing the previous example:

   ```elixir
   defmodule CrossroadsInterface.CrdsGroupLeaderView do
     use CrossroadsInterface.Web, :view
   end
   ```
7. Add any templates you reference from your controller in
   `/apps/crossroads_interface/web/templates/name_of_controller/` directory. The above
   CrdsGroupLeaderController example renders the `app_root.html` template, which is
   contained in the `/web/templates/crds_group_leader/` directory. This looks like:

   ```html
   <app-root> Loading... </app-root>
   ```
8. Clear away Maestro `_build` directories located at `/` and
   `/apps/crossroads_interface/` in the Maestro project.
9. Run `mix compile` from the `/` and `/apps/crossroads_interface` directories to
   rebuild Maestro
10. Run `mix phoenix.server` and navigate in a web browser to the route you defined
   in the `router.ex` file.
