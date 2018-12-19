#!/bin/bash

PROJECT_NAME=${PROJECT_NAME:-$(basename $(pwd))}
CONTAINER_NAME=${CONTAINER_NAME:-${PROJECT_NAME}}

if hash docker-machine 2>/dev/null; then
    docker-machine start default
    eval $(docker-machine env default)
fi

docker network create ${PROJECT_NAME}
docker volume create ${CONTAINER_NAME}-tmp

docker run \
--name ${CONTAINER_NAME} \
--publish 8080:8080 \
--rm \
--mount source=${CONTAINER_NAME}-tmp,target=/usr/src/tmp \
--interactive \
--tty \
--network ${CONTAINER_NAME} \
${CONTAINER_NAME}:latest $@



