import { Kafka, Partitioners, Producer as KafkaProducer } from 'kafkajs';

class Producer {
    #topic: string;
    #producer: KafkaProducer;
    #isConnected: boolean = false;

    constructor( topic: string, brokers: string[] ) {
        const kafka = new Kafka({
            clientId: 'node-producer',
            brokers: brokers
        });

        this.#topic = topic;
        
        this.#producer = kafka.producer({
            createPartitioner: Partitioners.DefaultPartitioner
        });
    }

    async send (value: string, key: string = this.#getRandomKey()) {
        if(!this.#isConnected) {
            await this.#producer.connect();
            this.#isConnected = true;
        }

        const message = {
            key,
            value
        }

        const res = await this.#producer.send({
            topic: this.#topic,
            messages: [ message ]
        });

        console.log('Message: ' + JSON.stringify(message) + '\nProduced to: ' + JSON.stringify(res));
    }

    async disconnect () {
        await this.#producer.disconnect();
    }

    #getRandomKey () {
        return Math.round(Math.random() * 1000).toString();
    }
}

export default Producer;