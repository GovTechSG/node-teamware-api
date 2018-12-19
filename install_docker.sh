#!/bin/bash

sudo yum remove -y docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-selinux \
                  docker-engine-selinux \
                  docker-engine

sudo yum install -y yum-utils \
  device-mapper-persistent-data \
  lvm2

sudo yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo

sudo yum install -y docker-ce

sudo groupadd docker

sudo usermod -aG docker centos

sudo systemctl enable docker
sudo systemctl start docker

sudo curl -L "https://github.com/docker/compose/releases/download/1.23.1/docker-compose-$(uname -s)-$(uname -m)" -o /bin/docker-compose

sudo chmod +x /bin/docker-compose

sudo curl -L https://raw.githubusercontent.com/docker/compose/1.23.1/contrib/completion/bash/docker-compose -o /etc/bash_completion.d/docker-compose


