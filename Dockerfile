# Elixir 1.4.2.: https://hub.docker.com/_/elixir/
FROM elixir:1.4.4

ENV DEBIAN_FRONTEND=noninteractive

RUN mix local.hex --force
RUN mix local.rebar --force

# install the Phoenix Mix archive
ENV PHOENIX_VERSION 1.1.6
RUN mix archive.install --force https://github.com/phoenixframework/archives/raw/master/phoenix_new-$PHOENIX_VERSION.ez

# Install NodeJS 6.x, NPM, and bower
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash -
RUN apt-get install -y -q nodejs

# TODO: Do we really need bower?
RUN echo "{\"allow_root\": true }" > .bowerrc
RUN npm install -g bower

# Copy Maestro code, and remove microclients from that folder to allow mounting to different folder
COPY . /maestro
RUN rm -rf /maestro/microclients

# Copy micro clients
COPY ./microclients /microclients

COPY ./docker-entrypoint.sh /usr/local/bin
RUN chmod u+x /usr/local/bin/docker-entrypoint.sh

CMD sh -c "MIX_ENV=dev mix phoenix.server"
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]