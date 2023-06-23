// src: https://github.com/kafka-rust/kafka-rust/blob/master/examples/example-consume.rs
use kafka::consumer::{Consumer, FetchOffset, GroupOffsetStorage};
use kafka::error::Error as KafkaError;

const TITLE: &str = r"
 _____                                                   _       _   _                _____                 _          
|  __ \                                                 | |     | | (_)              / ____|               (_)         
| |__) |___  ___ ___  _ __ ___  _ __ ___   ___ _ __   __| | __ _| |_ _  ___  _ __   | (___   ___ _ ____   ___  ___ ___ 
|  _  // _ \/ __/ _ \| '_ ` _ \| '_ ` _ \ / _ \ '_ \ / _` |/ _` | __| |/ _ \| '_ \   \___ \ / _ \ '__\ \ / / |/ __/ _ \
| | \ \  __/ (_| (_) | | | | | | | | | | |  __/ | | | (_| | (_| | |_| | (_) | | | |  ____) |  __/ |   \ V /| | (_|  __/
|_|  \_\___|\___\___/|_| |_| |_|_| |_| |_|\___|_| |_|\__,_|\__,_|\__|_|\___/|_| |_| |_____/ \___|_|    \_/ |_|\___\___|                                 
";

// This program demonstrates consuming messages through a `Consumer`.
// This is a convenient client that will fit most use cases.  Note
// that messages must be marked and committed as consumed to ensure
// only once delivery.
fn main() {
    let broker = "host.docker.internal:9092".to_owned();
    let topic = "test".to_owned();
    let group = "rust-group2".to_owned();

    if let Err(e) = consume_messages(group, topic, vec![broker]) {
        println!("Failed consuming messages: {}", e);
    }
}

fn consume_messages(group: String, topic: String, brokers: Vec<String>) -> Result<(), KafkaError> {
    let mut con = Consumer::from_hosts(brokers)
        .with_topic(topic)
        .with_group(group)
        .with_fallback_offset(FetchOffset::Earliest)
        .with_offset_storage(GroupOffsetStorage::Kafka)
        .create()?;

    println!("{}", TITLE);

    loop {
        let mss = con.poll()?;

        // Remove the false if you want to exit after reading
        if false && mss.is_empty() {
            println!("No messages available right now.");
            return Ok(());
        }

        for ms in mss.iter() {
            for m in ms.messages() {
                let s = match std::str::from_utf8(m.value) {
                    Ok(v) => v,
                    Err(e) => panic!("Invalid UTF-8 sequence: {}", e),
                };
                println!(
                    "{}:{}@{}: {:?}",
                    ms.topic(),
                    ms.partition(),
                    m.offset,
                    s
                );
            }
            let _ = con.consume_messageset(ms);
        }
        con.commit_consumed()?;
    }
}