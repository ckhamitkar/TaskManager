import { ApolloServer, gql } from 'apollo-server';

const typeDefs = gql`
  type Task {
    id: ID!
    title: String!
    completed: Boolean!
  }
  type Query {
    tasks: [Task!]!
  }
  type Mutation {
    addTask(title: String!): Task!
    updateTask(id: ID!, title: String, completed: Boolean): Task!
    deleteTask(id: ID!): Boolean!
  }
`;

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

let tasks: Task[] = [];

const resolvers = {
  Query: {
    tasks: () => tasks,
  },
  Mutation: {
    addTask: (_: any, { title }: { title: string }) => {
      const newTask = { id: Date.now().toString(), title, completed: false };
      tasks.push(newTask);
      return newTask;
    },
    updateTask: (_: any, { id, title, completed }: { id: string; title?: string; completed?: boolean }) => {
      const task = tasks.find(t => t.id === id);
      if (!task) throw new Error('Task not found');
      if (title !== undefined) task.title = title;
      if (completed !== undefined) task.completed = completed;
      return task;
    },
    deleteTask: (_: any, { id }: { id: string }) => {
      const idx = tasks.findIndex(t => t.id === id);
      if (idx === -1) return false;
      tasks.splice(idx, 1);
      return true;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
