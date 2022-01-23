import amqp from 'amqplib/callback_api.js';
import mongoose from 'mongoose';

import Order from './models/orderModel.js'

mongoose.connect(process.env.MONGODB_URL);

amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }

    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        const queueName = "PAYMENT";
    
        channel.assertQueue(queueName, {
          durable: false
        });

        const queueName2 = 'EMAIL';
    
        channel.assertQueue(queueName2, {
          durable: false
        });

        channel.consume("PAYMENT", (data) => {
            console.log("Consuming PAYMENT service");
            const { email, user, subject, text } = JSON.parse(data.content);


            

            // Pode testar com qualquer email
            const emailTo = 'rafaeldacostafreire@gmail.com';
            // Nome do Usuário
            const userTo = 'Rafael Freire';
            // Título do Email
            const subjectEmail = 'Teste de Título';
            // Texto do Email
            const textEmail = 'Teste de Texto';
            
            channel.sendToQueue("EMAIL", Buffer.from(JSON.stringify({
                email: emailTo,
                user: userTo,
                subject: subjectEmail,
                text: textEmail
            })));

            channel.ack(data);
        });
    });
});
