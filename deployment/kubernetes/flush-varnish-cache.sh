#!/bin/bash

echo "";
echo "=================================";
echo "======== Pod flush on K8S =======";
echo "=================================";
echo "";

DEPLOYMENT=$1
FAILED=0

if [[ -z ${DEPLOYMENT+x} || ${DEPLOYMENT} = "" ]]; then
    FAILED=1
    echo "ERROR: You must provide the name of the Varnish deployment"
fi

if [[ ${FAILED} = 1 ]]; then
    echo "USAGE: ./flush-varnish-cache.sh cms-varnish"
    exit 1;
fi

echo -n " - Getting pods... "
PODS="$(kubectl get pods --selector=app=${DEPLOYMENT} -ao jsonpath='{range .items[*]}{@.metadata.name}{" "}{@.spec.template.spec.containers[].image}{"\n"}{end}')"

if [[ $? -ne 0 && ${#PODS[@]} -eq 0 ]]; then
    echo "failed."
    exit 1;
else
    if [[ ${PODS[0]} = "" ]]; then
        echo "failed."
        exit 1;
    fi
    echo "succeeded."
fi

for i in "${PODS[@]}"
do
    echo -n " - Deleting existing cache pod: ${i}... "
    DELETED=$(kubectl delete pod/${i})
    if [[ $? -ne 0 ]]; then
        echo "failed."
        echo ${DELETED}
        exit 1;
    else
        echo "succeeded."
    fi
done

echo "";
echo "Completed."