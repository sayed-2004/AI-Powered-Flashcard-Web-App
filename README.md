# AI-Powered Flashcard Web App

A full-stack study app that turns notes into flashcards automatically. Users can paste in text or upload a document, and the app uses the OpenAI API to generate a set of flashcards they can study, edit and save.

I built this because making flashcards by hand for revision took too long, and I wanted a faster way to turn lecture notes into something I could actually study from.

## Features

- Generate flashcards automatically from pasted text or uploaded documents
- Create, edit and delete your own flashcard sets
- User registration and login with JWT authentication
- Passwords are hashed before being stored
- Each user can only access their own flashcards
- Responsive design that works on desktop and mobile

## Tech Stack

**Frontend:** React, TypeScript
**Backend:** Node.js, Express
**Database:** MongoDB
**AI:** OpenAI API
**Auth:** JSON Web Tokens (JWT)

## Project Structure

```
client/   React frontend
server/   Express API, authentication and OpenAI integration
```

## Getting Started

### Prerequisites

- Node.js
- A MongoDB database (local or MongoDB Atlas)
- An OpenAI API key

### 1. Clone the repository

```
git clone https://github.com/sayed-2004/AI-Powered-Flashcard-Web-App.git
cd AI-Powered-Flashcard-Web-App
```

### 2. Set up the server

```
cd server
npm install
```

Create a `.env` file in the `server` folder containing your MongoDB connection string, a JWT secret, your OpenAI API key and the port for the server to run on.

Then start the server using the start script in `server/package.json`.

### 3. Set up the client

In a new terminal:

```
cd client
npm install
```

Then start the client using the start script in `client/package.json`.

## How It Works

1. The user registers or logs in, and the server returns a JWT that is used to authenticate future requests.
2. The user pastes notes or uploads a document on the dashboard.
3. The server sends the content to the OpenAI API with a prompt asking for question and answer pairs.
4. The generated flashcards are saved to MongoDB under that user's account.
5. The flashcards are shown on the frontend, where the user can study, edit or delete them.

## Future Improvements

- Spaced repetition to show harder cards more often
- Sharing flashcard sets with other users
- Support for more file types
