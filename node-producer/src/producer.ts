import { Kafka, Partitioners, Producer as KafkaProducer } from 'kafkajs';

class Producer {
    #topic: string;
    #producer: KafkaProducer;
    #isConnected: boolean = false;

    constructor( topic: string ) {
        const kafka = new Kafka({
            clientId: 'node-producer',
            brokers: ['localhost:9092']
        });

        this.#topic = topic;
        
        this.#producer = kafka.producer({
            createPartitioner: Partitioners.DefaultPartitioner
        });
    }

    async send (message: string, key: string = this.#getRandomKey()) {
        if(!this.#isConnected) {
            await this.#producer.connect();
            this.#isConnected = true;
        }

        await this.#producer.send({
            topic: this.#topic,
            messages: [
                {
                    key: key,
                    value: message
                }
            ]
        });
    }

    async disconnect () {
        await this.#producer.disconnect();
    }

    #getRandomKey () {
        return Math.round(Math.random() * 1000).toString();
    }
}

export default Producer;