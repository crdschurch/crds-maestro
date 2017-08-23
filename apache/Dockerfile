# Install Apache
FROM httpd:2.4

# environement variables
ENV apachePath /usr/local/apache2/conf
ENV binPath /usr/local/bin

# install git & python and do cleanup afterwards
RUN apt-get update -y \
&& apt-get install -y --force-yes \
git \
python \
&& rm -rf /var/lib/apt/lists/*

# pull down python script from build tools, then clean up
RUN mkdir /downloads \
&& cd /downloads \
&& git clone https://github.com/crdschurch/crds-build-tools.git \
&& apt-get remove -y git

# copy environement variable processing script into config directory, make it executable, then clean up 
RUN cd $apachePath \
&& cp /downloads/crds-build-tools/deployment/processApacheConfig.py processApacheConfig.py \
&& chmod u+x processApacheConfig.py \
&& rm -rf /downloads

# copy config files into container
COPY apache_site.docker.template.conf $apachePath
COPY httpd.conf $apachePath

# copy runtime script over, make it executable, and then run it
COPY docker-entrypoint.sh $binPath
RUN chmod u+x $binPath/docker-entrypoint.sh
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]