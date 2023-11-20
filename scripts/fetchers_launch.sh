#! /usr/bin/bash

#TODO DEAL WITH CLI ARGS FOR WHICH FETCHER TO LAUNCH

### Ekos fetcher ###

# Check node
if node --version >/dev/null 2>&1; then
    echo "Node is installed"
else
    echo "Node is not installed. Install node v18.x"
    exit 1
fi

# Check if node modules are installed locally
ROOT_DIR=$(dirname $(dirname $(realpath $0)))
cd $ROOT_DIR

if [ ! -d "node_modules" ]; then
    echo "Node modules are not installed locally. Installing..."
    npm install
fi
if [ $? -neq 0 ]; then
    echo "Error installing node modules"
    exit 1
fi

# Run ekos fetcher until no error
SCRIPT_DIR=$(dirname $(realpath $0))
cd $SCRIPT_DIR
NODE_SCRIPT="fetchEkos.js"
while true; do
    node $NODE_SCRIPT
    if [ $? -eq 0 ]; then
        echo "Ekos fetcher exited with no error"
        break
    fi
    echo "Ekos fetcher exited with error. Restarting..."
done


