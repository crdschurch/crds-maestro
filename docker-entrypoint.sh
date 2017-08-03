#!/bin/sh
set -e

if [ ! -z "$FORCE_DEPS_GET" ] || [ ! -d /maestro/deps ] || [ ! "$(ls -A /maestro/deps)" ]; then
    cd /maestro
    mix deps.get
fi

if [ ! -z "$FORCE_NPM_INSTALL" ] || [ ! -d /maestro/apps/crossroads_interface/node_modules ] || [ ! "$(ls -A /maestro/apps/crossroads_interface/node_modules)" ] ; then
    cd /maestro/apps/crossroads_interface
    npm install
fi

if [ ! -z "$FORCE_MAESTRO_RECOMPILE" ] ; then
    export MIX_PARAMS="$MIX_PARAMS --force"
fi

cd /maestro
exec "$@"