#!/bin/sh
set -e

echo "Checking for dependencies."

if [ ! -z "$FORCE_MAESTRO_RECOMPILE" ] ; then
    echo "Recompiling Maestro"
    cd /maestro
    # This command may fail on windows due to locked file in _build/dev/lib/crossroads_interface/priv/
    # but it will have made it far enough to force a recompile
    set +e
    mix clean --only
    set -e
fi

if [ ! -z "$FORCE_DEPS_GET" ] || [ ! -d /maestro/deps ] || [ ! "$(ls -A /maestro/deps)" ]; then
    echo "Updating Phoenix dependencies"
    cd /maestro
    rm -rf _build/
    rm -rf deps/
    rm -rf apps/crossroads_interface/_build
    rm -rf apps/crossroads_interface/deps
    mix deps.get
fi

if [ ! -z "$FORCE_NPM_INSTALL" ] || [ ! -d /maestro/apps/crossroads_interface/node_modules ] || [ ! "$(ls -A /maestro/apps/crossroads_interface/node_modules)" ] ; then
    echo "Running NPM install..."
    cd /maestro/apps/crossroads_interface
    npm install
fi

echo "Maestro for dev live watching."

cd /maestro
MIX_ENV=$MIX_ENV mix phoenix.server $MIX_PARAMS