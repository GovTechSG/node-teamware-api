#!/bin/bash -x
PROJECT_NAME=${PROJECT_NAME:-$(basename $(pwd))}
CONTAINER_NAME=${CONTAINER_NAME:-${PROJECT_NAME}}-mongodump

ARCHIVE_FILE=${PROJECT_NAME}_mongo_$(date +'%Y%m%d%H%M%S').log



if hash docker-machine 2>/dev/null; then
    docker-machine start default
    eval $(docker-machine env default)
fi

docker network create ${PROJECT_NAME}

mkdir -p $(pwd)/mongodump

docker run \
--name ${CONTAINER_NAME}-mongo \
--publish 27017:27017 \
--rm \
--mount type=bind,source=$(pwd)/mongodump,target=/mnt/mongodump \
--interactive \
--tty \
--network ${PROJECT_NAME} \
mongo:latest \
bash
# mongodump --verbose --uri mongodb://${PROJECT_NAME}-mongo_1:27017 --gzip --out /mnt/mongodump/${ARCHIVE_FILE}

#--mount source=mongod,target=/data/db \
# --volume $(pwd)/data:/data/db:Z \


