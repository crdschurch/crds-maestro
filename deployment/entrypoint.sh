#!/bin/bash

sed -i "s/{{CRDS_PRERENDER_IO_KEY}}/${CRDS_PRERENDER_IO_KEY}/" /etc/nginx/conf.d/default.conf

echo "Maestro for production started." \
  && nginx \
  && /maestro/bin/crossroads_interface foreground