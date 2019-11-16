# download BTFS installer
wget https://raw.githubusercontent.com/TRON-US/btfs-binary-releases/master/install.sh

# install on linux
bash install.sh -o linux -a amd64

# insert BTFS Path into the system
echo 'export PATH=${PATH}:${HOME}/btfs/bin' >> ~/.profile

# make BTFS available without reboot
source ~/.profile

# Initialize BTFS
btfs init

# Create configuratio
touch ~/btfs/config.yaml

# insert config btfs version, order by version.go
echo 'version: 0.2.2' >> ~/btfs/config.yaml

# insert config btfs binary md5
echo 'vmd5: 034cf64b76f8bf5f506ce6aca9fa81c4' >> ~/btfs/config.yaml

# insert config is auto update
echo 'autoupdateFlg: true' >> ~/btfs/config.yaml

# insert config how often to auto update (seconds)
echo 'sleepTimeSeconds: 20' >> ~/btfs/config.yaml

# Enable Cross-Origin Resource Sharing
btfs config --json API.HTTPHeaders.Access-Control-Allow-Origin "[\"*\"]"

# allow PUT, GET, POST, OPTIONS as requests
btfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "GET", "POST", "OPTIONS"]'

# allow Credentials
btfs config --json API.HTTPHeaders.Access-Control-Allow-Credentials "[\"true\"]"

# enable api port 5001
btfs config Addresses.API /ip4/0.0.0.0/tcp/5001

# enable gateway through port 8080
btfs config Addresses.Gateway /ip4/0.0.0.0/tcp/8080

# Run in background
nohup btfs daemon </dev/null >/dev/null 2>&1 &

# see peer connections
btfs swarm peers