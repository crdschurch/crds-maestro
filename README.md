# Maestro - Crossroads Microclient Implementation in Elixir/Phoenix

## Environment Setup

### Install the latest stable version of elixir
Follow the guide located on the [elixir site](http://elixir-lang.org/install.html).

### Install the Phoenix Mix archive
There is a great [guide on the phoenix site](http://www.phoenixframework.org/docs/installation), but essentially you will just run:
`$ mix archive.install https://github.com/phoenixframework/archives/raw/master/phoenix_new.ez` to install the mix archive.

### Install node.js >= 5.0.0
This is environment specific, please visit [https://nodejs.org/en/](https://nodejs.org/en/) for instructions on installing on your operating system. 

## Up and running
1. Clone the project to your local machine: `git clone https://github.com/crdschurch/crds-maestro.git`
  
2. Check out the development branch: `cd crds-maestro && git checkout development`

3. Install Phoenix dependencies by running the following command: `mix deps.get && cd apps/crossroads_interface && mix deps.get`

  >This project is an [umbrella project](http://elixir-lang.org/getting-started/mix-otp/dependencies-and-umbrella-apps.html#umbrella-projects)
  >which lets us break it into smaller pieces. 
  >The phoenix portion is in the `apps/crossroads_interface` directory and probably where you will be working most of the time. 

4. Install javascript dependencies in the `crossroads_interface` directory: `npm install`

5. Build your microclients separately from crds-maestro.  Just clone the repo in some other local directory (which I'll refer to as $MICROCLIENT_HOME) as you normally would and follow the    instructions provided in the repo to build the microclient.  Currently their are microclient branches in the repositories for crds-angular, crds-embed, and crds-connect named: `feature-release/phoenix`.  So for crds-angular, do the following in some local directory $MICROCLIENT_HOME:
  ```
  MICROCLIENT_HOME=~/microclients
  cd $MICROCLIENT_HOME
  git clone https://github.com/crdschurch/crds-angular.git
  cd crds-angular
  git checkout feature-release/phoenix
  cd crossroads.net
  npm install
  gulp build
  ```

6. Link the assets of your microclient into the maestro project.  Each microclient will have it's own directory under `crossroads_interface/priv/static/js`, with a name that matches the controller created in Phoenix for the microclient.

So to link the assets for crds-angular and crds-connect:
```
 cd crds-maestro/apps/crossroads_interface
 mkdir -p priv/static/js
 ln -s $MICROCLIENT_HOME/crds-angular/crossroads.net/assets priv/static/js/legacy
 ln -s $MICROCLIENT_HOME/crds-connect/dist priv/static/js/crds_connect
 ```
 
 Windows Users:
 
 #### In Windows command window (run as administrator):
 ```
 cd crds-maestro/apps/crossroads_interface/priv
 mkdir static/js
 cd static/js
 mklink legacy $MICROCLIENT_HOME/crds-angular/crossroads.net/assets
 mklink crds_connect $MICROCLIENT_HOME/crds-connect/dist 
 cd ..
 ```
 #### In Bash Shell:
  ```
  cd crds-maestro/apps/crossroads_interface/priv
 mkdir static/js
 cd static/js
 ln -s $MICROCLIENT_HOME/crds-angular/crossroads.net/assets legacy 
 ln -s $MICROCLIENT_HOME/crds-connect/dist  crds_connect  
 cd ..
  ```


8. Kick of the build and the server: `mix phoenix.server`

>You may be prompted to install rebar3.  If so, select Y to continue.

## Server Setup
The following steps are needed to configure the Maestro application to run on a Ubuntu server after a Phoenix / Elixir / Distillery package has been created.

1. Create a service account (maestro)
2. Configure the SSL Certificates on the server to allow the maestro user / group to have read access
3. Create a directory for the Maestro application
```
sudo mkdir /var/maestro
sudo chown -R maestro:maestro /var/maestro
sudo chmod 755 /var/maestro
```
4. Configure startup script (assuming Ubuntu 14.04 upstart)
* Copy the `config/maestro.conf` from this repository to `/etc/init`
* Edit `/etc/init` as appropriate
* Run `sudo initctl reload-configuration` for Upstart to reload configuration

5. Create a releases directory under `/var/maestro`
6. Extract maestro release.tar.gz file to `/var/maestor/releases/DATE_TIME` folder
7. Create a symbolic link from `/var/maestro/current` to `/var/maestor/releases/DATE_TIME`
8. Start the service using `sudo service maestro start`
