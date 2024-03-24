import amqp from 'amqplib';

async function consumer() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  const exchange = "direct-exchange"
  const [queueName, ...routingKeys] = process.argv.slice(2);
  await channel.assertExchange(exchange, 'direct', { durable: true });
  const q = await channel.assertQueue(queueName, { durable: true });
  
  for (const routingKey of routingKeys) {
    await channel.bindQueue(q.queue, exchange, routingKey);

    console.log(`Bound with direct-exchange:${routingKey}`);
  }

  channel.consume(
    q.queue,
    async (msg) => {
      console.log(`[${msg.fields.routingKey}] Received`, msg.content.toString());
    },
    { noAck: true }
  );

  console.log('[*] Waiting for messages in direct. To exit press CTRL+C');
}

consumer()
