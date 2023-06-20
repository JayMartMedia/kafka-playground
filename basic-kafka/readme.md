# Walk through

Start up kafka/zk containers: `docker-compose up -d`

Attach to kafka broker container: `docker exec -it broker //bin//bash`

*From inside broker container*

Create topic: `kafka-topics --bootstrap-server broker:9092 --topic test --create`

Consume from topic: `kafka-console-consumer --bootstrap-server broker:9092 --topic test --from-beginning`

Produce to topic: `kafka-console-producer --bootstrap-server broker:9092 --topic test`

Produce to topic with keys: `kafka-console-producer --bootstrap-server broker:9092 --topic test --property parse.key=true --property key.separator=":"`

