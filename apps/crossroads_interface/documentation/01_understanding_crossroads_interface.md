*Primary Responsibility of Maestro CrossroadsInterface*

Maestro’s CrossroadsInterface responsibility is to serve as a top-level, super
router to several javascript framework single page applications termed
microclients. This part of Maestro lives at
“crds-maestro/apps/crossroads_interface” in the crds-maestro
project on github. When a user navigates to “https://www.crossroads.net/”,
Maestro matches the “/” route and serves up the crds-angular microclient. At
this point all routing is handled by the microclient SPA that has been
delivered to the client. As users navigate around that microclient, the path
in the address bar updates accordingly.

When a user clicks a link that goes to a route external to the current
microclient, that route request bubbles back up to Maestro, which attempts
to match the request route, and, upon a successful match, delivers the SPA
assets associated with the requested route to the client.
