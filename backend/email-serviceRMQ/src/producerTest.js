import amqp from 'amqplib/callback_api.js';

amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
          throw error1;
        }

        const queueName = 'EMAIL';
    
        channel.assertQueue(queueName, {
          durable: false
        });
        
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
        
        console.log(`Dados enviados para a Queue ${queueName}`);
    });
});