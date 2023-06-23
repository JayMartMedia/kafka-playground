using Confluent.Kafka;

class Program
{
    private static string title = @"
   ____          _             _   _       _   _  __ _           _   _                _____                 _          
  / __ \        | |           | \ | |     | | (_)/ _(_)         | | (_)              / ____|               (_)         
 | |  | |_ __ __| | ___ _ __  |  \| | ___ | |_ _| |_ _  ___ __ _| |_ _  ___  _ __   | (___   ___ _ ____   ___  ___ ___ 
 | |  | | '__/ _` |/ _ \ '__| | . ` |/ _ \| __| |  _| |/ __/ _` | __| |/ _ \| '_ \   \___ \ / _ \ '__\ \ / / |/ __/ _ \
 | |__| | | | (_| |  __/ |    | |\  | (_) | |_| | | | | (_| (_| | |_| | (_) | | | |  ____) |  __/ |   \ V /| | (_|  __/
  \____/|_|  \__,_|\___|_|    |_| \_|\___/ \__|_|_| |_|\___\__,_|\__|_|\___/|_| |_| |_____/ \___|_|    \_/ |_|\___\___|
    ";

    public static void Main(string[] args)
    {
        var conf = new ConsumerConfig
        { 
            GroupId = "dotnet-group",
            BootstrapServers = "localhost:9092",
            // Note: The AutoOffsetReset property determines the start offset in the event
            // there are not yet any committed offsets for the consumer group for the
            // topic/partitions of interest. By default, offsets are committed
            // automatically, so in this example, consumption will only start from the
            // earliest message in the topic 'my-topic' the first time you run the program.
            AutoOffsetReset = AutoOffsetReset.Earliest
        };

        using (var c = new ConsumerBuilder<Ignore, string>(conf).Build())
        {
            c.Subscribe("test");

            CancellationTokenSource cts = new CancellationTokenSource();
            Console.CancelKeyPress += (_, e) => {
                e.Cancel = true; // prevent the process from terminating.
                cts.Cancel();
            };

            Console.WriteLine(title);

            try
            {
                while (true)
                {
                    try
                    {
                        var cr = c.Consume(cts.Token);
                        Console.WriteLine($"Consumed message '{cr.Message.Value}' at: '{cr.TopicPartitionOffset}'.");
                    }
                    catch (ConsumeException e)
                    {
                        Console.WriteLine($"Error occured: {e.Error.Reason}");
                    }
                }
            }
            catch (OperationCanceledException)
            {
                // Ensure the consumer leaves the group cleanly and final offsets are committed.
                c.Close();
            }
        }
    }
}