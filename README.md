```markdown
# SocialNet Backend

SocialNet is a social networking platform. This repository contains the backend code built with Node.js, Express, and MongoDB.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Development](#development)
- [Environment Variables](#environment-variables)
- [Testing](#testing)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Future Enhancements](#future-enhancements)
- [Contact](#contact)
- [License](#license)

## Introduction

SocialNet is a social networking application that allows users to create profiles, post updates, send friend requests, and more. This repository contains the backend codebase, which provides RESTful APIs to interact with the frontend.

## Features

- User authentication and authorization
- Profile creation and management
- Posting updates and comments with text
- Sending and accepting friend requests
- CRUD operations for posts, comments, and user profiles
- Middleware for security and error handling

## Technologies

- **Node.js**: JavaScript runtime for building scalable network applications
- **Express**: Web application framework for Node.js
- **MongoDB**: NoSQL database for storing user and post data
- **Mongoose**: ODM for MongoDB
- **Passport.js**: Middleware for authentication
- **JWT**: For secure user authentication
- **Winston**: For logging
- **Helmet**: For securing HTTP headers
- **Rate Limit**: For limiting repeated requests

## Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/yourusername/socialnet-backend.git
   cd socialnet-backend
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

## Development

To run the project locally:

1. **Start the development server:**

   ```sh
   npm run dev
   ```

2. **The server will be running on:**

   ```
   http://localhost:5000
   ```

## Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority
SESSION_SECRET=your-session-secret
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
JWT_SECRET=your-jwt-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NODE_ENV=development
```

Replace `<username>`, `<password>`, `<dbname>`, `your-session-secret`, `your-jwt-secret`, `your-google-client-id`, and `your-google-client-secret` with your actual credentials and secrets.

## Testing

To run tests, use the following command:

```sh
npm run test
```

## Deployment

To deploy this project, follow these steps:

1. **Build the project:**

   ```sh
   npm run build
   ```

2. **Deploy to your preferred hosting provider.**

### Fly.io Configuration

Ensure your `fly.toml` file is configured correctly:

```toml
# fly.toml configuration

app = "socialnet-backend"

[build]
  image = "Dockerfile"

[env]
  MONGO_URI = "your-mongodb-uri"
  SESSION_SECRET = "your-session-secret"
  FRONTEND_URL = "your-frontend-url"
  BACKEND_URL = "your-backend-url"
  JWT_SECRET = "your-jwt-secret"
  GOOGLE_CLIENT_ID = "your-google-client-id"
  GOOGLE_CLIENT_SECRET = "your-google-client-secret"
  NODE_ENV = "production"
```

## Project Structure

```
/src
  /config       # Configuration files
  /controllers  # Route controllers
  /middleware   # Custom middleware
  /models       # Mongoose models
  /routes       # Express routes
  /scripts      # Seed users script
  /tests        # All the backend tests
  /utils        # Utility functions
  app.js        # Main application file
  server.js     # Server setup file
```

## Future Enhancements

- Implement real-time notifications using WebSockets
- Add image and video upload functionality in posts
- Improve security features
- Add more unit and integration tests
- Integrate Swagger for API documentation

## Contact

If you have any questions or suggestions, feel free to reach out to me at JoshuaFoti64@gmail.com.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.
```