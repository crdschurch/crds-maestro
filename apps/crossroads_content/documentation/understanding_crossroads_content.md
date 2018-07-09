*Primary Responsibility of Maestro CrossroadsContent*

Maestro’s CrossroadsContent responsibility is to create a wrapper layer for the
Silverstripe CMS. This part of Maestro lives at
“crds-maestro/apps/crossroads_content” in the crds-maestro project on github.
When this application is started, a number of endpoints internal to the crds-maestro
project are exposed which make it easier to create a mental model of the data
from Silverstripe you are retrieving and working with. Instead of making direct
calls to the Silverstripe rest api via HTTPoison:

```
HTTPoison.get("https://www.crossroads.net/proxy/content/api/pages")
```

and having to parse out the response data, a call to
CrossroadsContent.Pages.get_pages(String, Bool) results in pages from the CMS
parsed into an easy to work with data structure. There are several of these
endpoints within the CrossroadsContent project, and they live in either
`crds-maestro/apps/crossroads_content/lib/cms_client.ex` or
`crds-maestro/apps/crossroads_content/lib/content_pages.ex`.
`crds-maestro/apps/crossroads_content/lib/crossroads_content.ex` is a
configuration file responsible for starting up the various GenServers associated
with `cms_client.ex` and `content_pages.ex`.
`crds-maestro/apps/crossroads_content/lib/publications_client.ex` is a GenServer
project that has since been abandoned, is not in use, and can be ignored.
