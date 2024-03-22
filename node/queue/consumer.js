import amqp from 'amqplib';
import { setTimeout } from 'timers/promises'

async function consumer() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  await channel.assertQueue('hello', { durable: true });
  await channel.prefetch(2);

  channel.consume(
    'hello',
    async (msg) => {
      const [message, count] = msg.content.toString().split(' ');
      console.log(' [x] Received start', message, count);
      if (message.startsWith('wait')) {
        await setTimeout(count * 1000)
      }
      console.log(' [x] Received end', message, count);

      channel.ack(msg);
    },
  );

  console.log(' [*] Waiting for messages in direct. To exit press CTRL+C');
}

consumer()
