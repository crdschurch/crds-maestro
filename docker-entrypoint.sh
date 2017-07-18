#!/bin/sh
set -e

if [ ! -d /crossroads-phoenix/deps ]; then
    cd /crossroads-phoenix
    mix deps.get
fi

if [ ! -d /crossroads-phoenix/apps/crossroads_interface/node_modules ]; then
    cd /crossroads-phoenix/apps/crossroads_interface
    npm install
fi

cd /crossroads-phoenix
exec "$@"