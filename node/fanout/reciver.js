import amqp from 'amqplib';

async function consumer() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  await channel.assertExchange('message', 'fanout', { durable: false });

  const exchange = "message"
  await channel.assertExchange(exchange, 'fanout', { durable: false });
  const q = await channel.assertQueue('', { exclusive: true });
  await channel.bindQueue(q.queue, exchange, '');

  channel.consume(
    q.queue,
    async (msg) => {
      console.log(' [x] Received', msg.content.toString());
    },
    { noAck: true }
  );

  console.log(' [*] Waiting for messages in direct. To exit press CTRL+C');
}

consumer()
