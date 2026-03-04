---
title: "Docker in Oracle VM: Gotenberg Setup"
description: "Installing Docker in Oracle VM and using Gotenberg for document conversion and PDF generation"
pubDate: "Feb 1 2026"
categories: ["DevOps"]
---

#### Local testing

```bash title="Installing Docker"
choco install docker-desktop
docker --version
```

or go to [Docker Website](https://www.docker.com/products/docker-desktop) and download the installer

```bash title="Pull Gotenberg and run"
docker pull gotenberg/gotenberg:8 
docker run -d --name gotenberg -p 3000:3000 gotenberg/gotenberg:8
docker ps # check if the container is running
docker logs gotenberg # check the logs
curl http://localhost:3000/health # api health check
```

Once everything is set up, stop the container and remove it

```bash
docker stop gotenberg # stop the container
docker rm -f gotenberg # remove the container
```

---

#### Oracle VM setup

<!-- ###### Create reserved IP

Navigate: **Networking > IP Management > Reserved Public IPs**

- Click **"Reserve Public IP Address"**
- **Name**: `gotenberg-ip`
- **Compartment**: (your compartment)
- Click **"Reserve Public IP Address"**
- Copy the IP address -->

###### Create instance

- **Name**: `gotenberg-server`
- **Image**: Ubuntu 22.04
- **Shape**:
    - Click "Change Shape"
    - Select **Ampere (ARM)** → **VM.Standard.A1.Flex**
    - OCPU: 2, Memory: 12GB (free tier)
- **Networking**:
    - Use default VCN or create new
    - **Public IPv4 address**: Yes
        <!-- - Select **"Use a reserved public IP"** -->
        <!-- - Choose `gotenberg-ip` from dropdown -->
- **SSH Keys**:
    - click `Generate SSH key pair`
    - Download private key (`.key` file)
- **After creating instance**:
    - Compute > Instances > gotenberg-server
    - Check the public IP address
    
###### Add Ingress Rule

Navigate: **Networking > Virtual Cloud Networks > [Your VCN] > Security Lists > Default Security List > Add Ingress Rules**

**Rule 1 - Gotenberg:**
- Stateless: No
- Source Type: CIDR
- Source CIDR: 0.0.0.0/0
- IP Protocol: TCP
- Source Port Range: All
- Destination Port Range: 3000
- Description: Gotenberg API

**Rule 2 - SSH:**
- Destination Port Range: 22

---

#### Run Gotenberg in Oracle VM

```bash title="SSH Connect and Setup"
ssh -i ~/.ssh/your-key ubuntu@instance-public-ip

# update and upgrade the instance
sudo apt update && sudo apt upgrade -y

# docker setup
sudo apt install -y docker.io

sudo systemctl start docker 
sudo systemctl enable docker

# install ufw
sudo ufw allow 22/tcp 
sudo ufw allow 3000/tcp 
sudo ufw enable
sudo ufw status # check status

# Oracle Cloud iptables setting
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 3000 -j ACCEPT

sudo usermod -aG docker $USER # add user to docker group

# exit and reconnect for docker group to take effect
exit
ssh -i ~/.ssh/your-key ubuntu@instance-public-ip
```

```bash title="Run Gotenberg"
docker pull gotenberg/gotenberg:8 
docker run -d --name gotenberg -p 3000:3000 gotenberg/gotenberg:8

# check if the container is running
docker ps
sleep 5
curl http://localhost:3000/health
```
