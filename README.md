Para rodar a aplicação:

1) Adicione um arquivo .env nos 3 serviços: Users, Products e Orders. Adicione a variável "MONGODB_URL" com o link para conexão com o MongoDB e em cada serviço criando seu proprio Schema

2) Adicione um arquivo .env no serviço API Gateway com as variáveis ORDERS_API_URL, USERS_API_URL e PRODUCTS_API_URL com a URL de cada serviço

3) Adicione um arquivo .env no serviço de Email com as variáveis USER_TRANSPORTER(Endereço de email que enviará entre aspas simples), PASSWORD_TRANSPORTER(Senha do email entre aspas simples), AMAZONA_EMAIL(Endereço de email que enviará sem aspas simples) e EMAIL_SERVICE(Ex: 'gmail')

4) Em cada serviço:

- API Gateway
- Users 
- Products
- Orders
- Payment
- Email

E no client-side:

- Frontend

Dê um: 

### yarn install

Seguido de:

### yarn run start

