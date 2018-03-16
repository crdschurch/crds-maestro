# Crossroads Infrastructure for Maestro

The Maestro directory of _crds-infrastructure_ houses our infrastructure automation scripts and any other tools we need to deploy Maestro to a new environment. Sub-folder descriptions below:

## Sub Folders

Folder Name | Description
---------|----------
Kubernetes | YAML configs for creating load balancer, persistant volumes, deployments, and any other pieces in running the CMS in Kubernetes. No environment variables included.

## Set-Up
To set up the environment is relatively easy. Here are the steps to recreate a full environment.

### Pre-Requesites
See Devy McOpsFace or Prod Support for more information.

- Azure CLI Installed
- SSH keys
- Azure Service Principal Account & Password
- Azure Tenant Id for Crossroads
- Azure Subscription ID

### Getting Started

1. Log in to Azure CLI by executing `az login -u {service-principal-id} --service-principal --tenant    {service-principal-id} -p {service-principal-password}`
2. Set the subscription by executing `az account set -s {subscription-id}`
3. Connect to Kubeneretes Cluster by executing `az acs kubernetes get-credentials --resource-group {group-name} --name {k8s-cluster-name}`
4. Create `secrets` to store SSL certificates. *You will need to download the crossroads wildcard SSL crt and key. They must be named `tls.crt` and `tls.key` or Maestro and the Ingress controller won't pick them up.*
    1. Execute `kubectl create secret generic crossroads-ssl --from-file=c:/path-to-ssl/tls.crt  --from-file=c:/path-to-ssl/tls.key`
5. Begin creating app on Kubernetes Cluster. Start by navigating into the `Kubernetes` folder and then:
    1. Execute `kubectl create -f services.yaml --record --save-config`
    2. Execute `kubectl create -f ingress-configmap.yaml`
    3. Execute `kubectl create -f ingress-rules.yaml` *(you'll need to replace the environment variable values here)*
    4. Execute `kubectl create -f ingress-controller.yaml`
    5. Execute `kubectl create -f deployment-phoenix.yaml --record --save-config` *(you'll need to replace the environment variable values here)*
    6. Execute `kubectl create -f hpa-scale.yaml`

At this point, you should have a fully functioning Maestro app. Executing `kubectl get all` should show you the load balancer service and IP. You'll need that IP when setting up DNS.