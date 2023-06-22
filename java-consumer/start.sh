#!/bin/bash
docker build -t java-consumer .
docker run -it --name java-consumer java-consumer
