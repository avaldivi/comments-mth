import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import App from './App';

const mock = new MockAdapter(axios);
const mockComments = [
  {
    id: 1,
    name: 'User 1',
    message: 'Test Comment 1',
    created: '2024-06-17 02:03:38',
  },
  {
    id: 2,
    name: 'User 2',
    message: 'Test Comment 2',
    created: '2024-06-17 02:03:38',
  },
];

jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  useQuery: jest.fn(),
  useMutation: jest.fn(),
}));

const queryClient = new QueryClient();

const renderWithClient = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
};

describe('CommentFeed and CommentForm', () => {
  beforeEach(() => {
    (useQuery as jest.Mock).mockImplementation(() => ({
      isLoading: false,
      error: null,
      data: mockComments,
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
    mock.reset();
  });

  test('should render comments', async () => {
    renderWithClient();

    expect(screen.getByText('Test Comment 1')).toBeInTheDocument();
    expect(screen.getByText('Test Comment 2')).toBeInTheDocument();
  });
});
