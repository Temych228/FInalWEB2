# PetAdopt — Web Application

  This project is a full-stack web application designed to demonstrate the use of
Node.js, Express, and MongoDB for building a secure RESTful API.
The application allows users to register and log in, manage their personal profile,
and browse pets available for adoption.

  Each pet has a detailed page with relevant information, and authenticated users
can adopt pets through the platform.
After adoption, pets become unavailable to other users and are displayed
in the user’s profile.

  The backend is built with Express.js and follows a modular architecture with
separate routes, controllers, models, middleware, and configuration files.
MongoDB is used as the main database, and Mongoose is used for data modeling.

  User authentication is implemented using JSON Web Tokens (JWT),
and passwords are securely hashed using bcrypt.
Private API endpoints are protected with authentication middleware to ensure
that only authorized users can access or modify protected resources.

  The project includes role-based access control, where administrators are able
to manage pet data, while regular users can interact with the adoption system.
Overall, this project demonstrates core backend development concepts such as
authentication, authorization, database integration, and REST API design.



## Technologies Used

### Backend:
- **Node.js** — a JavaScript runtime environment used for building the server-side application.
- **Express.js** — a web framework for creating RESTful APIs and handling routing.
- **MongoDB** — a NoSQL database used to store data about users and pets.
- **Mongoose** — an ODM library for MongoDB used to define schemas and interact with the database.
- **JWT (JSON Web Token)** — used for user authentication and for protecting private routes.
- **bcrypt** — used to securely hash user passwords.

### Frontend:
- **HTML** — used to structure the web pages.
- **CSS** — used to style and design the user interface.
- **JavaScript** — used to implement client-side logic and communicate with the backend API.



## Project Structure

Ок, доделываю полностью — **до конца**, со всеми папками и файлами, которые у тебя видны 👇

### 📂 Project Structure (FINALWEB2)

```txt
FINALWEB2/
├── back/
│   └── src/
│       ├── config/
│       │   └── db.js
│       ├── controllers/
│       │   ├── adoption.controller.js
│       │   ├── auth.controller.js
│       │   └── pet.controller.js
│       ├── middleware/
│       │   ├── auth.middleware.js
│       │   └── role.middleware.js
│       ├── models/
│       │   ├── Pet.js
│       │   └── User.js
│       ├── routes/
│       │   ├── adoption.routes.js
│       │   ├── auth.routes.js
│       │   └── pet.routes.js
│       ├── app.js
│       └── server.js
│
├── front/
│   ├── css/
│   │   ├── style.css
│   │   └── style1.css
│   ├── html/
│   │   ├── birds.html
│   │   ├── cats.html
│   │   ├── dogs.html
│   │   ├── index.html
│   │   ├── login.html
│   │   ├── pet.html
│   │   └── profile.html
│   ├── images/
│   │   ├── birds/
│   │   ├── cats/
│   │   ├── dogs/
│   │   └── bg.jpg
│   └── js/
│       ├── auth.js
│       ├── category.js
│       ├── index.js
│       ├── nav.js
│       ├── pet.js
│       └── profile.js
│
├── node_modules/
├── .env
├── .gitignore
├── back.zip
├── package-lock.json
├── package.json
└── Readme.md
```

  The project is organized using a modular structure.
The backend is separated into routes, controllers, models, middleware,
and configuration files, which improves readability and maintainability.

  The frontend is implemented using HTML, CSS, and JavaScript
and is separated from the backend logic.



## Setup Instructions

1. Clone the repository:
   git clone https://github.com/USERNAME/REPO_NAME.git

2. Navigate to the project directory:
   cd FINALWEB2

3. Install dependencies:
   npm install

4. Install dotenv (if not installed):
   npm install dotenv

5. Create a `.env` file in the root directory and add the following variables:
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
6. Run the application:
   npm run dev



## Authentication Flow

  User authentication in the application is implemented using JSON Web Tokens (JWT).

  During registration, the user provides a username, email, and password.
The password is securely hashed using bcrypt before being stored in the database.

  During login, the provided credentials are verified.
If the credentials are valid, the server generates a JWT token and sends it to the client.
The token is stored on the client side and is included in the Authorization header
for all subsequent requests to protected API endpoints.

  Protected routes use authentication middleware to verify the JWT token.
If the token is valid, the request is allowed and the user gains access to
their personal profile and other protected resources.



## API Documentation

### Authentication (Public)

POST /api/auth/register  
Registers a new user.

POST /api/auth/login  
Authenticates a user and returns a JWT token.

### User Profile (Private)

GET /api/auth/me  
Returns the profile of the authenticated user.

PUT /api/auth/me  
Updates the profile information of the authenticated user.

### Pets

GET /api/pets  
Returns a list of all available pets.

GET /api/pets/:id  
Returns detailed information about a specific pet.

POST /api/pets  
Creates a new pet (admin only).

PUT /api/pets/:id  
Updates pet information (admin only).

DELETE /api/pets/:id  
Deletes a pet (admin only).

### Adoption

POST /api/pets/:id/adopt  
Allows an authenticated user to adopt a pet.



## Database Structure

  The application uses MongoDB as the primary database.
Data is organized into the following collections:

### User
<img width="924" height="367" alt="image" src="https://github.com/user-attachments/assets/44b2bd1f-5647-444d-a889-b87f05dde5d1" />


The User collection stores information about registered users.

Fields:
- username — the user’s display name
- email — the user’s email address
- password — hashed user password
- role — user role (user or admin)
- address — user address (optional)
- isBanned — indicates whether the user is banned
- likedPets — list of liked pets
- adoptedPets — list of adopted pets
- adoptionRequests — list of adoption requests

### Pet
<img width="931" height="267" alt="image" src="https://github.com/user-attachments/assets/8ccf0fb1-4bd9-44fd-86a1-446e02353401" />


The Pet collection stores information about animals available for adoption.

Fields:
- name — pet name
- type — pet category (dog, cat, bird)
- gender — pet gender
- age — pet age
- description — pet description
- location — pet location
- photoUrl — path to pet image
- isAvailable — indicates whether the pet is available for adoption
- owner — reference to the user who owns or added the pet



## Authors

- Safaryan Artyom
- Daniyar Ayazbaev
- Faizrakhman Alikhan

- Group: SE-2408
