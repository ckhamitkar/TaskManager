Taskmaster

Taskmaster is a lightweight and scalable Task Management application built with:

Node.js – Backend runtime

React – Frontend UI

GraphQL – API layer

TypeScript – Type-safe development

MongoDB – Persistent data storage

This project serves as a full-stack example that demonstrates how these technologies work together to create a responsive, type-safe, and scalable task management tool. It demonstrates how these technologies work together to deliver a modern full-stack application.

Here’s how a request flows through the architecture:

1. Frontend (React + Apollo Client)
The user interacts with the UI (e.g., adds a task).
Apollo Client sends a GraphQL mutation or query to the backend (e.g., addTask, tasks).
Backend (Node.js + Apollo Server)

2. Apollo Server receives the GraphQL request at /graphql (default).
The request is matched to a resolver function in index.ts.

3. Resolver
The resolver (e.g., addTask) runs the corresponding logic.
For data operations, it uses Mongoose to interact with MongoDB.

4. Database (MongoDB)
Mongoose executes the query/mutation on the tasks collection in MongoDB.
The result (e.g., the new task) is returned to the resolver.

5. Response
The resolver returns the result to Apollo Server.
Apollo Server sends the GraphQL response back to the frontend.
Apollo Client updates the UI with the new data.

Summary:
React UI → Apollo Client → Apollo Server (GraphQL) → Resolver → Mongoose → MongoDB → Resolver → Apollo Server → Apollo Client → UI

All data access is through GraphQL resolvers; the frontend never talks directly to MongoDB.