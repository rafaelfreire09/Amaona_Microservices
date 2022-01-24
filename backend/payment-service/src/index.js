import amqp from 'amqplib/callback_api.js';
import axios from 'axios';

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

        channel.consume("PAYMENT", (data) => {
            console.log("Consuming PAYMENT service");

            const order = JSON.parse(data.content);

            // Processa o pagamento

            const status = {
                paymentStatus: "success",
                paymentResult: {
                    id: order.paymentResult.id,
                    status: order.paymentResult.status,
                    update_time: order.paymentResult.update_time,
                    email_address: order.paymentResult.email_address,
                }
            };

            // Envia o status para o Serviço de Pedido

            axios.put(`http://localhost:5003/orders/status`, { status });

            channel.ack(data);
        });
    });
});
