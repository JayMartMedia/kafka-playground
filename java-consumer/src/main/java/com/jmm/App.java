package com.jmm;

import java.time.Duration;
import java.util.Arrays;
import java.util.Properties;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.Producer;
import org.apache.kafka.clients.producer.ProducerRecord;

public class App {

    private static final String BOOTSTRAP_SERVERS = "host.docker.internal:9092";
    private static final String CONSUMER_GROUP = "java-consumer"
    private static final String TOPIC = "orders";
    private static final String TITLE = """
  ______     _  __ _ _ _                      _      _____                 _          
 |  ____|   | |/ _(_) | |                    | |    / ____|               (_)         
 | |__ _   _| | |_ _| | |_ __ ___   ___ _ __ | |_  | (___   ___ _ ____   ___  ___ ___ 
 |  __| | | | |  _| | | | '_ ` _ \\ / _ \\ '_ \\| __|  \\___ \\ / _ \\ '__\\ \\ / / |/ __/ _ \\
 | |  | |_| | | | | | | | | | | | |  __/ | | | |_   ____) |  __/ |   \\ V /| | (_|  __/
 |_|   \\__,_|_|_| |_|_|_|_| |_| |_|\\___|_| |_|\\__| |_____/ \\___|_|    \\_/ |_|\\___\\___|
                                                                                      
    """;

    public static void main(String[] args) throws Exception {
        Thread consumerThread = new Thread(App::consume);
        consumerThread.start();
        // consume();
    }

    private static void consume() {
        // Create configuration options for our consumer
        Properties props = new Properties();
        props.setProperty("bootstrap.servers", BOOTSTRAP_SERVERS);
        // The group ID is a unique identified for each consumer group
        props.setProperty("group.id", CONSUMER_GROUP);
        // Since our producer uses a string serializer, we need to use the corresponding
        // deserializer
        props.setProperty("key.deserializer",
                "org.apache.kafka.common.serialization.StringDeserializer");
        props.setProperty("value.deserializer",
                "org.apache.kafka.common.serialization.StringDeserializer");
        // Every time we consume a message from kafka, we need to "commit" - that is, acknowledge
        // receipts of the messages. We can set up an auto-commit at regular intervals, so that
        // this is taken care of in the background
        props.setProperty("enable.auto.commit", "true");
        props.setProperty("auto.commit.interval.ms", "1000");

        // Since we need to close our consumer, we can use the try-with-resources statement to
        // create it
        try (KafkaConsumer<String, String> consumer = new KafkaConsumer<>(props)) {
            // Subscribe this consumer to the same topic that we wrote messages to earlier
            consumer.subscribe(Arrays.asList(TOPIC));

            System.out.println(TITLE);

            // run an infinite loop where we consume and print new messages to the topic
            while (true) {
                // The consumer.poll method checks and waits for any new messages to arrive for the
                // subscribed topic
                // in case there are no messages for the duration specified in the argument (1000 ms
                // in this case), it returns an empty list
                ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(1000));
                for (ConsumerRecord<String, String> record : records) {
                    System.out.printf("received message: %s\n", record.value());
                }
            }
        }
    }

}