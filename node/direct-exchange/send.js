import amqp from 'amqplib';
import { setTimeout } from 'timers/promises'

async function emitLog() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  const exchange = "direct-exchange"
  const [routingKey, inputMessage] = process.argv.slice(2)

  await channel.assertExchange(exchange, 'direct', { durable: true });
  channel.publish(exchange, routingKey, Buffer.from(inputMessage));

  await setTimeout(200)

  await connection.close()
}

emitLog()
