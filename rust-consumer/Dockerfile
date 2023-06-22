FROM rust:1.70.0-bullseye
RUN apt-get install libssl-dev
COPY . .
RUN cargo build
CMD [ "cargo", "run" ]