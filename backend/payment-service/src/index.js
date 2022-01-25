import amqp from 'amqplib/callback_api.js';
import axios from 'axios';

amqp.connect('amqp://localhost', function (error0, connection) {
    // if (error0) {
    //     throw error0;
    // }

    connection.createChannel(function (error1, channel) {
        // if (error1) {
        //     throw error1;
        // }

        try {
            const queueName = "PAYMENT";

            channel.assertQueue(queueName, {
                durable: false
            });

            channel.consume("PAYMENT", async (data) => {
                console.log("Consuming PAYMENT service");

                const { paymentData } = JSON.parse(data.content);
                // Processa o pagamento

                const status = {
                    paymentStatus: "success",
                    paymentResult: {
                        id: paymentData.paymentResult.id,
                        status: paymentData.paymentResult.status,
                        update_time: paymentData.paymentResult.update_time,
                        email_address: paymentData.paymentResult.email_address,
                    }
                };

                // Envia o status para o Serviço de Pedido
                console.log(paymentData);
                await axios.put(`http://localhost:5003/orders/${paymentData.order._id}/status/${paymentData.order.user}`, { status });
                // console.log(teste);
                // channel.ack(data);
            }
            )
        } catch (error) {
            console.log(error.message);
        }

    });
});
