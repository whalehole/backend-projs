require('dotenv').config();
const amqp = require('amqplib/callback_api');
const TodoService = require('./service/todo');

const consumer = () => amqp.connect(process.env.AMQPSHOST || 'amqp://localhost:5672', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        const todoService = new TodoService();

        if (error1) {
            throw error1;
        }

        const queue = 'todolist_user';

        channel.assertQueue(queue, {
            durable: true
        });

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

        channel.consume(queue, function(msg) {
            const payload = JSON.parse(msg.content);
            todoService.giveAccess(payload['userId'], payload['listId']);
        }, {
            noAck: true
        });
    });
});

module.exports = consumer;