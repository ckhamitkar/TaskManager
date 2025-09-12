
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

  if (loading) return <p style={{ textAlign: 'center', color: '#6366f1', marginTop: '2rem' }}>Loading...</p>;
  if (error) return <p style={{ textAlign: 'center', color: '#ef4444', marginTop: '2rem' }}>Error: {error.message}</p>;

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
    <div className="task-container">
      <div className="task-title">Task List</div>
      <form className="task-form" onSubmit={handleAdd}>
        <input
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          placeholder="New task title"
        />
        <button type="submit">Add</button>
      </form>
      <ul className="task-list">
        {data.tasks.map((task: any) => (
          <li key={task.id} className="task-item">
            <input
              className="task-checkbox"
              type="checkbox"
              checked={task.completed}
              onChange={() => handleToggle(task.id, task.completed)}
            />
            <span className={`task-text${task.completed ? ' completed' : ''}`}>{task.title}</span>
            <button className="task-delete" onClick={() => handleDelete(task.id)} title="Delete">×</button>
          </li>
        ))}
      </ul>
    </div>
  );
}


function App() {
  return (
    <div className="App">
      <ApolloProvider client={client}>
        <TaskApp />
      </ApolloProvider>
    </div>
  );
}

export default App;
