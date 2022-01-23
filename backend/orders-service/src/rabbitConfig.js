import amqp from 'amqplib/callback_api.js';

const CONN_URL = 'amqp://localhost';

let channel = null;

amqp.connect(CONN_URL, function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, ch) {
        if (error1) {
          throw error1;
        }

        channel = ch;

        const queueName = 'PAYMENT';
    
        channel.assertQueue(queueName, {
          durable: false
        });
    });
});

export const publishToQueue = async (queueName, data) => {
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)), { persistent: true });
}

// process.on('exit', (code) => {
//     ch.close();
//     console.log('Closing RabiitMQ channel')
// })