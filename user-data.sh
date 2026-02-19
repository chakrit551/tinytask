#!/bin/bash
set -e

# Update & Install Docker
apt-get update
curl -fsSL https://get.docker.com | sh
systemctl enable docker

# Install Docker Compose
COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep tag_name | cut -d '"' -f 4)
curl -L "https://github.com/docker/compose/releases/download/${COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Install Dokploy
curl -sSL https://dokploy.com/install.sh | bash

# Firewall
ufw --force enable
ufw allow 22,80,443,3000/tcp
