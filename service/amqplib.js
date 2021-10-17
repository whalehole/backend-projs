const amqplib = require('amqplib');

class Rabbit {
    publish = async (queueName, message) => {
        const client = await amqplib.connect('amqp://localhost:5672');
        const channel = await client.createChannel();
        await channel.assertQueue(queueName);
        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
            contentType: 'application/json',
        })
        return "published";
    }
}

module.exports = Rabbit;