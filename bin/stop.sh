#!/bin/sj

PID_NODE=`ps -ef |grep "node ./bin/www_oidc" |grep -v grep|awk '{ print $2 }'`

echo "PID_NODE is: " $PID_NODE

if [ -n "$PID_NODE" ]; then
kill -9 $PID_NODE
fi

if [ -n "$PID_JS" ]; then
kill -9 $PID_JS
fi

echo "service is not ready"
