#!/bin/sh
set -e

if [ ! -z "$FORCE_MAESTRO_RECOMPILE" ] ; then
    cd /maestro
    # This command may fail on windows due to locked file in _build/dev/lib/crossroads_interface/priv/
    # but it will have made it far enough to force a recompile
    set +e
    mix clean --only
    set -e
fi

if [ ! -z "$FORCE_DEPS_GET" ] || [ ! -d /maestro/deps ] || [ ! "$(ls -A /maestro/deps)" ]; then
    cd /maestro
    mix deps.get
fi

if [ ! -z "$FORCE_NPM_INSTALL" ] || [ ! -d /maestro/apps/crossroads_interface/node_modules ] || [ ! "$(ls -A /maestro/apps/crossroads_interface/node_modules)" ] ; then
    cd /maestro/apps/crossroads_interface
    npm install
fi

cd /maestro
exec "$@"