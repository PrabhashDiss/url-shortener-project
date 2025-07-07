# URL Shortener API

A simple and efficient URL shortening service built with Node.js, Express, and MongoDB. The entire application is containerized using Docker and Docker Compose for easy setup and deployment.

This project serves as a great learning tool for understanding REST APIs, database interaction with Mongoose, and modern development workflows with Docker.

## Features

- **Convert Long URLs**: Transform any long URL into a short, unique, and easy-to-share alias.
- **URL Redirect**: Automatically redirects short URLs to their original destination.
- **RESTful API**: A clean and simple API for creating and managing URLs.
- **Fully Containerized**: Runs the Node.js application and the MongoDB database in isolated Docker containers.
- **Single-Command Setup**: Use Docker Compose to build, run, and manage the entire application stack with one command.
- **Persistent Data**: Uses a named Docker volume to ensure your shortened URLs are saved even after containers are stopped or removed.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (with Mongoose as the ODM)
- **Containerization**: Docker, Docker Compose
- **Utilities**:
    - `shortid`: For generating unique URL codes.
    - `dotenv`: For managing environment variables.
    - `cors`: For enabling Cross-Origin Resource Sharing.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- [Docker](https://www.docker.com/products/docker-desktop/)
- [Docker Compose](https://docs.docker.com/compose/install/) (Included with Docker Desktop)
- [Git](https://git-scm.com/) (for cloning the repository)
- An API client like [Postman](https://www.postman.com/) or `curl` for testing the endpoints.

## Getting Started

Follow these steps to get the project up and running on your local machine.

### 1. Clone the Repository

```bash
git clone https://github.com/PrabhashDiss/url-shortener-project
cd url-shortener-project

```

### 2. Build and Run with Docker Compose

Now, you can build the Docker images and start the containers for both the application and the database with a single command:

```bash
docker-compose up --build

```

- The `--build` flag tells Docker Compose to build the image for our `app` service from the `Dockerfile`. You only need to use it the first time or after changing the source code or `Dockerfile`.
- You will see logs from both services. Wait for the message `MongoDB connected successfully.` to appear.

The application will now be running at `http://localhost:5000`.

## API Usage

You can interact with the API using any API client.

### 1. Shorten a URL

Send a `POST` request to create a new short URL.

- **Endpoint**: `POST /api/shorten`
- **Request Body**: `JSON`
    
    ```json
    {
      "longUrl": "https://github.com/expressjs/express"
    }
    
    ```
    
- **Example with `curl`**:
    
    ```bash
    curl -X POST -H "Content-Type: application/json" -d "{\"longUrl\": \"https://github.com/expressjs/express\"}" http://localhost:5000/api/shorten
    
    ```
    
- **Success Response (201 Created)**:
    
    ```json
    {
        "_id": "63a5df26a63503f19e487926",
        "originalUrl": "https://github.com/expressjs/express",
        "urlCode": "Hk_jFmBq5",
        "shortUrl": "http://localhost:5000/Hk_jFmBq5",
        "createdAt": "2022-12-23T16:51:50.916Z",
        "__v": 0
    }
    
    ```
    
- **Error Response (400 Bad Request)**:
    - If `longUrl` is missing: `{"error": "Please provide a URL"}`
    - If `longUrl` format is invalid: `{"error": "Invalid URL format"}`

### 2. Redirect to Original URL

- **Endpoint**: `GET /{urlCode}`
- **Usage**: Simply open the `shortUrl` you received in your web browser.
- **Example**: Navigate to `http://localhost:5000/Hk_jFmBq5` in your browser.
- **Response**: The browser will be redirected (`302 Found`) to the original URL (`https://github.com/expressjs/express`).
- **Error Response (404 Not Found)**: If the `urlCode` does not exist in the database, you will receive a `{"error": "No URL found"}` message.

## Docker Compose Commands

Here are the essential Docker Compose commands for managing the application stack:

- **Start the services in the background:**
    
    ```bash
    docker-compose up -d
    
    ```
    
- **Stop the services:**
    
    ```bash
    docker-compose down
    
    ```
    
    *(This stops and removes the containers but preserves the MongoDB data in the `mongo-data` volume.)*
    
- **View logs:**
    
    ```bash
    docker-compose logs -f
    
    ```
    
    *(Use `docker-compose logs -f app` to see logs only for the app service.)*
    
- **Force a rebuild of the images:**
    
    ```bash
    docker-compose build
    
    ```
    

## Project Structure

```
.
├── models/
│   └── url.js           # Mongoose schema for URLs
├── .dockerignore        # Specifies files to ignore in Docker build
├── .env                 # Environment variables (you must create this)
├── docker-compose.yml   # Defines and configures the app and db services
├── Dockerfile           # Instructions to build the Node.js app image
├── index.js             # Main Express server file
├── package.json         # Project dependencies and scripts
└── README.md            # This file

```