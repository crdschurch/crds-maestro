#!/bin/sh
set -e

if [ ! -d /maestro/deps ] || [ ! "$(ls -A /maestro/deps)" ]; then
    cd /maestro
    mix deps.get
fi

if [ ! -d /maestro/apps/crossroads_interface/node_modules ] || [ ! "$(ls -A /maestro/apps/crossroads_interface/node_modules)" ] ; then
    cd /maestro/apps/crossroads_interface
    npm install
fi

cd /maestro
exec "$@"