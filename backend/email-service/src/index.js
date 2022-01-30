import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

import amqp from 'amqplib/callback_api.js';

dotenv.config();

const userTransporter = process.env.USER_TRANSPORTER
const passwordTransporter = process.env.PASSWORD_TRANSPORTER
const emailService = process.env.EMAIL_SERVICE

const transporter = nodemailer.createTransport({
    service: emailService,
    auth: {
        user: userTransporter,
        pass: passwordTransporter
    }
});

function sendMail(emailTo, userTo, subject, text) {
    transporter.sendMail({
        from: `Amazona <${process.env.AMAZONA_EMAIL}>`,
        to: `${emailTo}`,
        subject: `${subject}`,
        text: `Olá ${userTo}, ${text}`
    })
        .then((message) => {
            console.log(message);
        })
        .catch((err) => {
            console.log(err);
        })
}

amqp.connect('amqp://localhost', function (error0, connection) {
    if (error0) {
        console.log('aqu');
        throw error0;
    }

    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }

        const queueName = 'EMAIL';

        channel.assertQueue(queueName, {
            durable: false
        });

        channel.consume("EMAIL", (data) => {
            // console.log("Consuming EMAIL service");
            
            const { email, user, subject, text } = JSON.parse(data.content);

            // console.log(`Dados recebidos da Queue ${queueName}`);

            // console.log(`Email: ${email}`);
            // console.log(`User: ${user}`);
            // console.log(`Subject: ${subject}`);
            // console.log(`Text: ${text}`);

            sendMail(email, user, subject, text);

            channel.ack(data);
        });
    });
});



