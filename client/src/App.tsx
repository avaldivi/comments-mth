import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CommentGroup } from 'semantic-ui-react';

import CommentForm from './CommentForm';
import CommentFeed from './CommentFeed';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <div className='comment-layout'>
      <QueryClientProvider client={queryClient}>
        <div>
          <h1>Comments</h1>
          <CommentGroup>
            <CommentFeed />
            <div className='comment-layout-divider'></div>
            <CommentForm />
          </CommentGroup>
        </div>
      </QueryClientProvider>
    </div>
  );
}

export default App;
