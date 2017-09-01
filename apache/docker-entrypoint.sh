#!/bin/sh
set -e

# process the apache config file
cd $apachePath
rm -f apache_site.docker.conf
python processApacheConfig.py apache_site.docker.template.conf apache_site.docker.conf

# lines taken from /usr/local/bin/httpd-foreground (the original entrypoint for this image)
rm -f /usr/local/apache2/logs/httpd.pid
exec httpd -DFOREGROUND
