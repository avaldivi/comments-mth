import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CommentForm from './CommentForm';
import CommentFeed from './CommentFeed';
import logo from './logo.svg';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <div className='App'>
      <QueryClientProvider client={queryClient}>
        <div>
          <h1>Comments</h1>
          <CommentForm />
          <CommentFeed />
        </div>
      </QueryClientProvider>
    </div>
  );
}

export default App;
