# Maestro - Understanding How crds-angular and Cms Pages are Rendered

Perhaps one of the most confusing parts of the Maestro project is how the crds-legacy
AngularJS application is rendered along with CMS pages. It all starts with routing.

### Routing

You'll notice in the `/apps/crossroads_interface/web/router.ex` file that there are a
number of defined routes, and the final route is `/*`. This is a catchall route, and
so when someone makes a request to `www.crossroads.net/care/weddings` that route will
fall through all of the rest of the route definitions and match to the `/*` route
which corresponds to the LegacyController.

### LegacyController

Within the LegacyController a few things are happening. First when any call to the
`index` action within the LegacyController is made, first the plugs on lines 11-14
are run. Two of the plugs are responsible for adding data to the `conn` data
structure. The authorized plug simply checks to see if a user is signed in.

The `CrossroadsInterface.Plug.CmsPage` plug is of particular interest, though. This
plug checks to see if the requested route is a page in the CMS. If the route is a
page in the CMS, then the `conn.assigns` Map has a `:page` key added to it. Then,
back in the `LegacyController` there is a check on line 20 to see if
`conn.assigns[:page] != nil`. If that evaluates to true, then control is passed over
to the CmsPageController, which holds responsibility for rendering the HTML markup
that comes back from the CMS.

If it evaluates to false, then the LegacyController retains control over resolving
the request and delivering the crds-angular AngularJS application to the browser.
