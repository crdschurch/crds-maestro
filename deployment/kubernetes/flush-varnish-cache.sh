#!/bin/bash

echo "";
echo "=================================";
echo "======== Pod flush on K8S =======";
echo "=================================";
echo "";

DEPLOYMENT_TO_FLUSH=$1
DEPLOYMENT_TO_CHECK=$2
SLEEP_TIME=${3:-3s}
ITERATIONS_BEFORE_RECHECK=${4:-3}
ITERATIONS_BEFORE_BAIL=${5:-15}
FAILED=0

if [[ -z ${DEPLOYMENT_TO_FLUSH+x} || ${DEPLOYMENT_TO_FLUSH} = "" ]]; then
    FAILED=1
    echo "ERROR: You must provide the name of the Varnish deployment"
fi

if [[ ${FAILED} = 1 ]]; then
    echo "USAGE: ./flush-varnish-cache.sh cms-varnish"
    exit 1;
fi

if [[ -n ${DEPLOYMENT_TO_CHECK} && ${DEPLOYMENT_TO_CHECK} != "" ]]; then
    NUM_REPLICAS_EXPECTED="$(kubectl get deployments --selector=app=${DEPLOYMENT_TO_CHECK} -ao jsonpath='{.items[0].spec.replicas}')"
    NUM_REPLICAS_CURRENT="$(kubectl get deployments --selector=app=${DEPLOYMENT_TO_CHECK} -ao jsonpath='{.items[0].status.replicas}')"

    CHECK_COUNTER=0
    while [ ${NUM_REPLICAS_EXPECTED} != ${NUM_REPLICAS_CURRENT} ]; do
        sleep ${SLEEP_TIME}

        if [[ ${CHECK_COUNTER} -ne 0 && $((${CHECK_COUNTER} % ${ITERATIONS_BEFORE_RECHECK})) == 0 ]]; then
            echo "Refreshing replicas expected"
            NUM_REPLICAS_EXPECTED="$(kubectl get deployments --selector=app=${DEPLOYMENT_TO_CHECK} -ao jsonpath='{.items[0].spec.replicas}')"
        fi

        echo "Current Replicas: ${NUM_REPLICAS_CURRENT}/${NUM_REPLICAS_EXPECTED}"
        NUM_REPLICAS_CURRENT="$(kubectl get deployments --selector=app=${DEPLOYMENT_TO_CHECK} -ao jsonpath='{.items[0].status.replicas}')"
        CHECK_COUNTER=${CHECK_COUNTER}+1

        if [[ ${CHECK_COUNTER} -gt ${ITERATIONS_BEFORE_BAIL} ]]; then
            echo "Max iterations reached... bailing on confirming deploy has completed"
            break
        fi
    done
fi

echo -n " - Getting pods... "
PODS="$(kubectl get pods --selector=app=${DEPLOYMENT_TO_FLUSH} -ao jsonpath='{range .items[*]}{@.metadata.name}{" "}{@.spec.template.spec.containers[].image}{"\n"}{end}')"

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
echo "Gnarfle the garthok."