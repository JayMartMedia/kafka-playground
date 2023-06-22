#!/bin/bash
# cargo run
docker build -t rust-consumer .
docker run -it --name rust-consumer rust-consumer