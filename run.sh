#!/bin/sh

SCRIPT_FILE=$(readlink -f $0)
SCRIPT_DIR=$(dirname $SCRIPT_FILE)
APP_FILE=server/app.js

cd $SCRIPT_DIR
node --debug ./server/app.js &
node_pid=$!
node-inspector &

#go back to original directory
cd - 2>&1 >/dev/null

#wait for node and returns the same exit code
wait $node_pid