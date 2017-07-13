#!/bin/sh
set -e

# link from /microclients to crossroads-phoenix/apps/crossroads_interface/priv/static/js
# TODO: Can we accomplish this a different way? Maybe pointing Phoenix to look at the /microclients folder for it's stuff?
#rm -rf /crossroads-phoenix/apps/crossroads_interface/priv/static/js && \
#ln -s /microclients /crossroads-phoenix/apps/crossroads_interface/priv/static/js

# install depdencies
cd /crossroads-phoenix
mix deps.get

exec "$@"