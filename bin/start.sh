#!bin/sh
npm start > log/server.log  2> log/server_err.log < /dev/null &
sleep 3s

PID_NODE=`ps -ef |grep "node ./bin/www_oidc" |grep -v grep|awk '{ print $2 }'`

echo "PID_NODE is: " $PID_NODE
if [ -n "$PID_NODE" ]; then
        echo "service has started!!"
else
        echo "error ...sh stop.sh"
        sh stop.sh
fi
