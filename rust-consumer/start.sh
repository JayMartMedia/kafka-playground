#!/bin/bash
# cargo run
docker build -t rust-consumer .
docker run -it -e BROKER=host.docker.internal:9092 -e TOPIC=orders --name rust-consumer rust-consumer