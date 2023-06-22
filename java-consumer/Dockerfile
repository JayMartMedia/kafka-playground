FROM maven:3.9.2-eclipse-temurin-17
WORKDIR /app
COPY . .
RUN mvn clean compile assembly:single
CMD ["java", "-jar", "target/java-kafka-example-1.0-SNAPSHOT-jar-with-dependencies.jar"]