# Real-Time Communication with Socket.IO

Comprehensive example project demonstrating real-time communication using Socket.IO, Node.js (server), and a Vite + React client. This project implements a simple chat application with rooms, user lists, typing indicators, and file uploads — suitable for learning Socket.IO concepts and as a starting point for real-time features in larger apps.

--

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Requirements](#requirements)
- [Setup & Installation](#setup--installation)
  - [Server](#server)
  - [Client](#client)
- [Configuration](#configuration)
- [Running Locally](#running-locally)
- [How It Works (Architecture)](#how-it-works-architecture)
- [Key Files and Components](#key-files-and-components)
- [Usage Examples](#usage-examples)
- [Troubleshooting & Notes](#troubleshooting--notes)
- [Contributing](#contributing)
- [License](#license)

--

## Overview

This repository contains a full-stack example that demonstrates setting up real-time bidirectional communication between a browser client and a Node.js server using Socket.IO. The UI is built with React and Vite; the server is a minimal Node.js Express app that integrates Socket.IO for event-based messaging.

Use this project to learn about:

- Socket.IO server and client setup
- Emitting and listening for custom socket events (join, leave, message, typing, file-upload)
- Managing rooms and presence (online users, per-room user lists)
- Exchanging binary data (file uploads) over real-time channels

## Features

- Multi-room chat
- Real-time user list per room
- Typing indicators
- Sending text messages and file uploads
- Distinct client and server projects for clear separation of concerns

## Tech Stack

- Server: Node.js, Express, Socket.IO
- Client: React (JSX), Vite, Socket.IO client
- Build tools: npm, Vite

## Project Structure

Top-level layout:

```
real-time-communication-with-socket-io-Edwin-Art5/
├─ client/                  # Vite + React frontend
│  ├─ index.html
│  ├─ package.json
│  └─ src/
│     ├─ main.jsx
│     ├─ App.jsx
│     ├─ socket.js          # Socket client wrapper
│     └─ components/       # ChatRoom, Login, MessageList, etc.
└─ server/                  # Node.js backend
   ├─ package.json
   ├─ server.js             # HTTP + Socket.IO server
   └─ config/
      └─ socketConfig.js    # socket-related helpers/config

```

## Requirements

- Node.js 18+ recommended (or a recent LTS)
- npm (comes with Node.js)

## Setup & Installation

Follow these steps to run the app locally. We'll install dependencies for both server and client and then start each.

Important: open two terminals (or use a multiplexer) — one for the server, one for the client.

### Server

1. Open a terminal and change to the `server` directory:

```pwsh
cd e:/PLP/Mern-Stack/Week_5/real-time-communication-with-socket-io-Edwin-Art5/server
```

2. Install dependencies:

```pwsh
npm install
```

3. Start the server (example):

```pwsh
node server.js
# or if package.json defines a script:
npm run start
```

The server will listen on the configured port (commonly `3000` or `4000`). See [Configuration](#configuration).

### Client

1. Open a second terminal and change to the `client` directory:

```pwsh
cd e:/PLP/Mern-Stack/Week_5/real-time-communication-with-socket-io-Edwin-Art5/client
```

2. Install dependencies:

```pwsh
npm install
```

3. Start the dev server (Vite):

```pwsh
npm run dev
```

This will launch the React app (commonly at `http://localhost:5173`), which will connect to the Socket.IO server.

## Configuration

Environment/config options typically include:

- `PORT` — server port
- `CLIENT_URL` — the origin URL for the client (for CORS/socket origins)

Look in `server/server.js` and `server/config/socketConfig.js` for exact variables used by the project. If an `.env` file is used, create a `.env` in `server/` with entries such as:

```env
PORT=3000
CLIENT_URL=http://localhost:5173
```

When changing the socket origin/CORS, ensure the client connects using the same host/port combination.

## Running Locally (Quick Commands)

Open two PowerShell terminals:

Terminal 1 (server):

```pwsh
cd e:/PLP/Mern-Stack/Week_5/real-time-communication-with-socket-io-Edwin-Art5/server
npm install
node server.js
```

Terminal 2 (client):

```pwsh
cd e:/PLP/Mern-Stack/Week_5/real-time-communication-with-socket-io-Edwin-Art5/client
npm install
npm run dev
```

Open the client URL shown by Vite (usually `http://localhost:5173`).

## How It Works (Architecture)

- The server runs an Express HTTP server and attaches Socket.IO to it. Socket.IO handles WebSocket transport (with fallbacks) and manages namespaces/rooms.
- The client uses the Socket.IO client library to connect and emit/listen for events. Typical events include:
  - `join-room` / `leave-room` — join or leave a chat room
  - `message` — send/receive chat messages
  - `typing` / `stop-typing` — typing indicators
  - `user-list` — server emits updated room user list
  - `file-upload` — binary or base64-encoded file transfer events
- The server maintains room membership and forwards messages and presence events to other clients in the same room.

## Key Files and Components

- `server/server.js`: Server entrypoint. Creates HTTP server and initializes Socket.IO handlers.
- `server/config/socketConfig.js`: Socket helper functions, handlers, or configuration used by the server.
- `client/src/socket.js`: Socket client wrapper used by React components to emit and listen for socket events.
- `client/src/components/ChatRoom.jsx`: Main chat UI handling messages, users list, and file upload.
- `client/src/components/MessageList.jsx`: Renders chat messages.

Open these files to inspect how events are named and carried across the wire — useful if you want to extend the protocol or integrate authentication.

## Usage Examples

- Join a room: the client emits `join-room` with `{ room: 'my-room', username: 'Alice' }`.
- Send a message: the client emits `message` with the message payload; the server broadcasts to the room.
- Typing indicator: the client emits `typing` when the user starts typing, and `stop-typing` after a timeout or send.
- File upload: the client sends the file (either base64 or via a separate HTTP endpoint), then notifies other clients via a `file` event with metadata and/or a download URL.

Check the components in `client/src/components/` to see exact payload shapes.

## Troubleshooting & Notes

- CORS / origins: If the client cannot connect to the server, ensure the server allows the client origin in Socket.IO/CORS config.
- Port conflicts: make sure both client and server ports are free (default Vite port `5173`, server often `3000`).
- Binary transfers: sending large files over sockets can be inefficient; for production, consider using a standard file upload HTTP endpoint or cloud storage + notifications.

## Development Tips

- Hot-reload: Vite provides fast HMR for the client. Restarting the Node server may be required for server-side changes.
- Logging: enable server-side socket logs to debug event flow. Add `console.log` statements in `server/config/socketConfig.js` or handlers.

## Contributing

Contributions are welcome. Typical workflows:

1. Fork the repository and create a feature branch.
2. Implement changes and update or add components.
3. Run both client and server locally to verify behavior.
4. Open a pull request describing the changes.

When adding breaking changes to socket events, include migration notes explaining the event payload changes.

## License

This project doesn't include an explicit license in the repository by default. If you plan to share or publish, add a license file (for example, `MIT`) to the repository.

--

If you'd like, I can also:

- Add a short `CONTRIBUTING.md` or `ENVIRONMENT.md`.
- Add sample `.env.example` files in `server/` and `client/`.
- Create scripts in `package.json` to run both client and server concurrently (using `concurrently`).

Tell me which of the above you'd like me to do next.
