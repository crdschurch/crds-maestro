# Deploying Maestro

The Maestro deployment is built on Docker and made to run on Kubernetes. Below are the respective configurations for each component.

## Docker

All files that Docker needs to build and run exist in the Docker folder. There are `docker-compose` files for both production hosting and local development. To execute the following commands, make sure you are in the root of _crds-maestro_. NOTE: The `local.env` file controls the environment variables.

  1. To build locally:
     1. Execute `docker-compose -f deployment/docker/docker-compose-local.yml` build
  2. To run locally _(assumes it's already been built locally)_:
     1. Execute `docker-compose -f deployment/docker/docker-compose-local.yml` up

  3. To build for production _(int, demo, prod)_:
     1. Execute `docker-compose -f deployment/docker/docker-compose-prod.yml` build

## Kubernetes

This document assumes you have a working Kubernetes cluster with Ingress routing and SSL certificates already configured. If not, please visit _crds-infrastructure_ for more information.

*All commands below assume you've processed the YML scripts and replaced appropriate environment variables.*

  1. To deploy:
     1. Execute `kubectl apply -f deployment/kubernetes/deployment-maestro-phoenix.yml --record --save-config`
     2. Execute `kubectl apply -f deployment/kubernetes/services.yml --record --save-config`
     3. Execute `kubectl apply -f deployment/kubernetes/hpa-scale.yml --record --save-config`

## Varnish

Varnish for Maestro is set-up in our production environments. Please see the appropriate repository for configuration (UPDATE THIS LATER WITH REPOSITORY LINK)
