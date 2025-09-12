
import React, { useState } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, useMutation, gql } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:4000/',
  cache: new InMemoryCache(),
});

const GET_TASKS = gql`
  query GetTasks {
    tasks {
      id
      title
      completed
    }
  }
`;

const ADD_TASK = gql`
  mutation AddTask($title: String!) {
    addTask(title: $title) {
      id
      title
      completed
    }
  }
`;

const UPDATE_TASK = gql`
  mutation UpdateTask($id: ID!, $title: String, $completed: Boolean) {
    updateTask(id: $id, title: $title, completed: $completed) {
      id
      title
      completed
    }
  }
`;

const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id)
  }
`;

function TaskApp() {
  const { loading, error, data, refetch } = useQuery(GET_TASKS);
  const [addTask] = useMutation(ADD_TASK);
  const [updateTask] = useMutation(UPDATE_TASK);
  const [deleteTask] = useMutation(DELETE_TASK);
  const [newTitle, setNewTitle] = useState('');

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    await addTask({ variables: { title: newTitle } });
    setNewTitle('');
    refetch();
  };

  const handleToggle = async (id: string, completed: boolean) => {
    await updateTask({ variables: { id, completed: !completed } });
    refetch();
  };

  const handleDelete = async (id: string) => {
    await deleteTask({ variables: { id } });
    refetch();
  };

  return (
    <div className="App" style={{ maxWidth: 400, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h2>Task List</h2>
      <form onSubmit={handleAdd} style={{ marginBottom: 16 }}>
        <input
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          placeholder="New task title"
          style={{ padding: 8, width: '70%' }}
        />
        <button type="submit" style={{ padding: 8, marginLeft: 8 }}>Add</button>
      </form>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {data.tasks.map((task: any) => (
          <li key={task.id} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleToggle(task.id, task.completed)}
              style={{ marginRight: 8 }}
            />
            <span style={{ flex: 1, textDecoration: task.completed ? 'line-through' : 'none' }}>{task.title}</span>
            <button onClick={() => handleDelete(task.id)} style={{ marginLeft: 8 }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function App() {
  return (
    <ApolloProvider client={client}>
      <TaskApp />
    </ApolloProvider>
  );
}

export default App;
