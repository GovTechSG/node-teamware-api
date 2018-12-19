#!/bin/bash
PROJECT_NAME=${PROJECT_NAME:-$(basename $(pwd))}
CONTAINER_NAME=${CONTAINER_NAME:-${PROJECT_NAME}}-mongo

if hash docker-machine 2>/dev/null; then
    docker-machine start default
    eval $(docker-machine env default)
fi

docker network create ${PROJECT_NAME}
docker volume create ${CONTAINER_NAME}-data-db


docker run \
--name ${CONTAINER_NAME}-mongo \
--publish 27017:27017 \
--rm \
--mount source=${CONTAINER_NAME}-data-db,target=/data/db \
--interactive \
--tty \
--network ${PROJECT_NAME} \
mongo:latest $@

#--mount source=mongod,target=/data/db \
# --volume $(pwd)/data:/data/db:Z \


