import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider, MockLink } from '@apollo/client/testing';
import App from './App';
import { GET_TASKS, ADD_TASK, UPDATE_TASK, DELETE_TASK } from './App';

const mocks = [
  {
    request: {
      query: GET_TASKS,
    },
    result: {
      data: {
        tasks: [{ id: '1', title: 'Test Task', completed: false, __typename: 'Task' }],
      },
    },
  },
  {
    request: {
      query: ADD_TASK,
      variables: { title: 'New Task' },
    },
    result: {
      data: {
        addTask: { id: '2', title: 'New Task', completed: false, __typename: 'Task' },
      },
    },
  },
  {
    request: {
      query: UPDATE_TASK,
      variables: { id: '1', completed: true },
    },
    result: {
      data: {
        updateTask: { id: '1', title: 'Test Task', completed: true, __typename: 'Task' },
      },
    },
  },
  {
    request: {
      query: DELETE_TASK,
      variables: { id: '1' },
    },
    result: {
      data: {
        deleteTask: '1',
      },
    },
  },
];

import { ApolloClient, InMemoryCache } from '@apollo/client';

describe('TaskApp', () => {
  it('renders loading state initially', () => {
    const mockClient = new ApolloClient({
      link: new MockLink(mocks),
      cache: new InMemoryCache(),
    });
    render(
      <App client={mockClient} />
    );
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it('renders tasks', async () => {
    const mockClient = new ApolloClient({
      link: new MockLink(mocks),
      cache: new InMemoryCache(),
    });
    render(
      <App client={mockClient} />
    );
    await waitFor(() => expect(screen.getByText(/Test Task/i)).toBeInTheDocument());
  });

  it('adds a task', async () => {
    const newMocks = [
      mocks[0],
      {
        request: {
          query: ADD_TASK,
          variables: { title: 'New Task' },
        },
        result: {
          data: {
            addTask: { id: '2', title: 'New Task', completed: false, __typename: 'Task' },
          },
        },
      },
      {
        request: {
          query: GET_TASKS,
        },
        result: {
          data: {
            tasks: [
              { id: '1', title: 'Test Task', completed: false, __typename: 'Task' },
              { id: '2', title: 'New Task', completed: false, __typename: 'Task' },
            ],
          },
        },
      },
    ];
    const mockClient = new ApolloClient({
      link: new MockLink(newMocks),
      cache: new InMemoryCache(),
    });

    render(
      <App client={mockClient} />
    );
    await waitFor(() => expect(screen.getByText(/Test Task/i)).toBeInTheDocument());

    fireEvent.change(screen.getByPlaceholderText(/New task title/i), {
      target: { value: 'New Task' },
    });
    fireEvent.click(screen.getByText(/Add/i));

    await waitFor(() => expect(screen.getByText(/New Task/i)).toBeInTheDocument());
  });

  it('toggles a task', async () => {
    const updatedMocks = [
      mocks[0],
      {
        request: {
          query: UPDATE_TASK,
          variables: { id: '1', completed: true },
        },
        result: {
          data: {
            updateTask: { id: '1', title: 'Test Task', completed: true, __typename: 'Task' },
          },
        },
      },
      {
        request: {
          query: GET_TASKS,
        },
        result: {
          data: {
            tasks: [{ id: '1', title: 'Test Task', completed: true, __typename: 'Task' }],
          },
        },
      },
    ];
    const mockClient = new ApolloClient({
      link: new MockLink(updatedMocks),
      cache: new InMemoryCache(),
    });

    render(
      <App client={mockClient} />
    );
    await waitFor(() => expect(screen.getByText(/Test Task/i)).toBeInTheDocument());

    fireEvent.click(screen.getByRole('checkbox'));

    await waitFor(() => {
      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
      expect(checkbox.checked).toBe(true);
    });
  });

  it('deletes a task', async () => {
    const newMocks = [
      mocks[0],
      {
        request: {
          query: DELETE_TASK,
          variables: { id: '1' },
        },
        result: {
          data: {
            deleteTask: '1',
          },
        },
      },
      {
        request: {
          query: GET_TASKS,
        },
        result: {
          data: {
            tasks: [],
          },
        },
      },
    ];
    const mockClient = new ApolloClient({
      link: new MockLink(newMocks),
      cache: new InMemoryCache(),
    });

    render(
      <App client={mockClient} />
    );
    await waitFor(() => expect(screen.getByText(/Test Task/i)).toBeInTheDocument());

    fireEvent.click(screen.getByTitle(/Delete/i));

    await waitFor(() => expect(screen.queryByText(/Test Task/i)).not.toBeInTheDocument());
  });
});
