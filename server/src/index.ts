import { ApolloServer, gql } from 'apollo-server';
import mongoose from 'mongoose';

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


const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false }
});

const TaskModel = mongoose.model('Task', taskSchema);

const resolvers = {
  Query: {
    tasks: async () => {
      const tasks = await TaskModel.find();
      return tasks.map(task => ({
        id: task._id.toString(),
        title: task.title,
        completed: task.completed
      }));
    },
  },
  Mutation: {
    addTask: async (_: any, { title }: { title: string }) => {
      const newTask = new TaskModel({ title });
      await newTask.save();
      return { id: newTask._id.toString(), title: newTask.title, completed: newTask.completed };
    },
    updateTask: async (_: any, { id, title, completed }: { id: string; title?: string; completed?: boolean }) => {
      const task = await TaskModel.findById(id);
      if (!task) throw new Error('Task not found');
      if (title !== undefined) task.title = title;
      if (completed !== undefined) task.completed = completed;
      await task.save();
      return { id: task._id.toString(), title: task.title, completed: task.completed };
    },
    deleteTask: async (_: any, { id }: { id: string }) => {
      const result = await TaskModel.deleteOne({ _id: id });
      return result.deletedCount === 1;
    },
  },
};

async function startServer() {
  await mongoose.connect('mongodb://localhost:27017/taskmanager', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as any);
  const server = new ApolloServer({ typeDefs, resolvers });
  server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
}

startServer();
