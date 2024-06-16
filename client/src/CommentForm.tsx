import React, { useState } from 'react';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const CommentForm: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newComment: { name: string; message: string }) =>
      axios.post('http://localhost:3001/api/createComment', newComment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ name, message: comment });
    setName('');
    setComment('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name</label>
        <input
          type='text'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label>Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>
      <button type='submit'>Submit</button>
    </form>
  );
};

export default CommentForm;
