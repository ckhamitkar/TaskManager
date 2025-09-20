
import React, { useState } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, useMutation, gql, ApolloClientOptions, HttpLink } from '@apollo/client';

export const createClient = (options?: ApolloClientOptions<any>) => {
  const httpLink = new HttpLink({
    uri: 'http://localhost:4000/',
  });

  return new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache({
      canonizeResults: false,
    }),
    ...options,
  });
};

export const GET_TASKS = gql`
  query GetTasks {
    tasks {
      id
      title
      completed
    }
  }
`;

export const ADD_TASK = gql`
  mutation AddTask($title: String!) {
    addTask(title: $title) {
      id
      title
      completed
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation UpdateTask($id: ID!, $title: String, $completed: Boolean) {
    updateTask(id: $id, title: $title, completed: $completed) {
      id
      title
      completed
    }
  }
`;

export const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id)
  }
`;


/**
 * TaskApp is a functional component that provides a complete task management interface.
 * It uses Apollo Client for GraphQL mutations (add, update, delete) and queries (get all tasks).
 *
 * @component
 * @example
 * return (
 *   <TaskApp />
 * )
 */
function TaskApp() {
  // GraphQL query to get all tasks
  const { loading, error, data, refetch } = useQuery(GET_TASKS);

  // GraphQL mutations for task manipulation
  const [addTask] = useMutation(ADD_TASK);
  const [updateTask] = useMutation(UPDATE_TASK);
  const [deleteTask] = useMutation(DELETE_TASK);

  // State for the new task title
  const [newTitle, setNewTitle] = useState('');

  // Display loading and error states
  if (loading) return <p style={{ textAlign: 'center', color: '#6366f1', marginTop: '2rem' }}>Loading...</p>;
  if (error) return <p style={{ textAlign: 'center', color: '#ef4444', marginTop: '2rem' }}>Error: {error.message}</p>;

  /**
   * Handles the form submission to add a new task.
   * @param {React.FormEvent} e - The form event.
   */
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    await addTask({ variables: { title: newTitle } });
    setNewTitle('');
    refetch();
  };

  /**
   * Toggles the completed state of a task.
   * @param {string} id - The ID of the task to toggle.
   * @param {boolean} completed - The current completed state of the task.
   */
  const handleToggle = async (id: string, completed: boolean) => {
    await updateTask({ variables: { id, completed: !completed } });
    refetch();
  };

  /**
   * Deletes a task.
   * @param {string} id - The ID of the task to delete.
   */
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


function App({ client: clientProp }: { client?: ApolloClient<any> }) {
  const client = clientProp || createClient();
  return (
    <div className="App">
      <ApolloProvider client={client}>
        <TaskApp />
      </ApolloProvider>
    </div>
  );
}

export default App;
