# CrossroadsInterface

To start your Phoenix app:

  * Install dependencies with `mix deps.get`
  * Install Node.js dependencies with `npm install`
  * Start Phoenix endpoint with `mix phoenix.server`

You can now visit [`localhost:4000`](http://localhost:4000) from your browser.

Ready to run in production? Please [check our deployment guides](http://www.phoenixframework.org/docs/deployment).

# FOR PROD SUPPORT
If at any point you need to turn off debugging, the following steps should be helpful

  * ssh into the prod site
  * navigate to `/var/maestro/crossroads.net/current/releases/{{current_release}}/`
  * open sys.config as a super user (sudo vim sys.config)
  * You should see a line like `{path,<<"/var/log/maestro/maestro.log">>},{level,debug}]}]}`
  * To turn off logging, change to the following: `{path,<<"/dev/null">>},{level,debug}]}]}`
  * To change the level of debugging, change `{level,debug}` (most amount of logging) to `{level,info}` (middle amount) or `{level,error}` (lease amount)
## Learn more

  * Official website: http://www.phoenixframework.org/
  * Guides: http://phoenixframework.org/docs/overview
  * Docs: http://hexdocs.pm/phoenix
  * Mailing list: http://groups.google.com/group/phoenix-talk
  * Source: https://github.com/phoenixframework/phoenix
