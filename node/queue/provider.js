import amqp from 'amqplib';
import { setTimeout } from 'timers/promises'
async function provider() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  await channel.assertQueue('hello', { durable: true });

  const sendCount = Number(process.argv.at(-1)) || 1;
  const message = process.argv.length === 4 ? process.argv.at(-2) : 'Hello';

  for (let i = 1; i <= sendCount; i++) {
    channel.sendToQueue('hello', Buffer.from(`${message} ${i}`));
  }

  await setTimeout(500)

  await connection.close()
}

provider()
