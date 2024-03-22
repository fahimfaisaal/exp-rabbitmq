import amqp from 'amqplib';
import { setTimeout } from 'timers/promises'

async function emitMessage() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  const exchange = "message"
  await channel.assertExchange(exchange, 'fanout', { durable: false });
  const q = await channel.assertQueue('', { exclusive: true });
  await channel.bindQueue(q.queue, exchange, '');

  const inputMessage = process.argv.at(-1);

  channel.publish(exchange, '', Buffer.from(inputMessage));

  await setTimeout(500)

  await connection.close()
}

emitMessage()
