import React, { useEffect } from 'react';
import axios from 'axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface Comment {
  id: number;
  name: string;
  message: string;
}

const fetchComments = async (): Promise<Comment[]> => {
  const response = await axios.get('http://localhost:3001/getComments');
  console.log(response);
  return response.data;
};

const CommentFeed: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: comments, isLoading } = useQuery<Comment[]>({
    queryKey: ['comments'],
    queryFn: fetchComments,
  });

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');
    ws.onmessage = (event) => {
      const newComment: Comment = JSON.parse(event.data);
      queryClient.setQueryData<Comment[]>(['comments'], (oldComments = []) => [
        ...oldComments,
        newComment,
      ]);
    };

    return () => {
      ws.close();
    };
  }, [queryClient]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <ul>
      {comments?.map((comment) => (
        <li key={comment.id}>
          <strong>{comment.name}</strong>: {comment.message}
        </li>
      ))}
    </ul>
  );
};

export default CommentFeed;
