# 👾 Amazona Microservices Migration

Original project: https://github.com/basir/amazona

---

## 🛠️ Tecnologies:

- Node.js
- Express
- Nodemailer
- MongoDB
- RabbitMQ
- API Gateway
- Docker Compose

---

## 🖥️ Screens:

<img src="./github/amazona.jpg" alt="image"/>

## 🚀 Routes:

Users Service:

1. http://localhost:5000/users/register (POST - Create user)
1. http://localhost:5000/users/signin (POST - Sign In)
1. http://localhost:5000/users/:id (GET - Get user details)
1. http://localhost:5000/users/profile (PUT - Update user profile)
1. http://localhost:5000/users/:id (PUT - Update user)
1. http://localhost:5000/users (GET - Get user list)
1. http://localhost:5000/users/:id (DELETE - Delete user)

Products Service:

1. http://localhost:5000/products/:id (GET - Get product details)
1. http://localhost:5000/products (POST - Create product)
1. http://localhost:5000/products/:id (PUT - Update product)
1. http://localhost:5000/products/:id (DELETE - Delete product)
1. http://localhost:5000/products?pageNumber=&seller=&name=&category=&min=&max=&rating=&order= (GET - List products)
1. http://localhost:5000/products/categories (GET - Get products categories)
1. http://localhost:5000/products/:id/reviews (Post - Create review)

Orders Service:

1. http://localhost:5003/orders (POST - Create Order)
1. http://localhost:5003/orders/:id (GET - Get order info)
1. http://localhost:5003/orders/:id/pay (PUT - Make payment)
1. http://localhost:5003/orders/mine (GET - Get user orders)
1. http://localhost:5003/orders?seller= (GET - ???)
1. http://localhost:5003/orders/ (DELETE - Delete order)
1. http://localhost:5003/orders/${orderId}/deliver (PUT - Deliver order)
1. http://localhost:5003/orders/summary (GET - Get order summary)

Routes Disabled:

1. http://localhost:5000/users/:id (GET - Get top seller) DISABLED
1. http://localhost:5000/products/uploads (Post - Make a upload) DISABLED
1. http://localhost:5003/orders/config/google (GET - Get Google config) DISABLED
1. http://localhost:5003/orders/config/paypal (GET - Get Paypal config) DISABLED

---

## ⚙️ Installation:

### Option 1(Docker):

1. First, if you dont have Git installed, download the zip file and extract him. If you have, clone the repository:

	```sh
	git clone https://github.com/rafaelfreire09/Amazona_Microservices.git
	```

2. Inside the project, run the docker-compose file to up MongoDB, RabbitMQ, Frontend and all services.

	```sh
	docker-compose up
	```

### Option 2(Without Docker):

1. First, if you dont have Git installed, download the zip file and extract him. If you have, clone the repository:

	```sh
	git clone https://github.com/rafaelfreire09/Amazona_Microservices.git
	```

1. You will need to configure and run RabbitMQ and the MongoDB on your machine to test the project.

1. In the Users, Products and Orders services, add a value to the environment variable "MONGODB_URL" with the link to connect to MongoDB.

1. In each directory:

    - /frontend
    - /api-gateway-service
    - /users-service
    - /products-service
    - /orders-service
    - /payment-service
    - /email-service

1. Install the necessary dependencies.

	```sh
	npm install
	```

1. And this to run:

	```sh
	npm start
	```
