import React, { useState } from 'react';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FormTextArea, Button, Form, FormField } from 'semantic-ui-react';

const CommentForm: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newComment: { name: string; message: string }) =>
      axios.post('http://localhost:3001/createComment', newComment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });

  const deleteComments = useMutation({
    mutationFn: () => axios.delete('http://localhost:3001/deleteComments'),
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
    <Form onSubmit={handleSubmit}>
      <FormField>
        <label>Name</label>
        <input
          value={name}
          type='text'
          onChange={(e) => setName(e.target.value)}
        />
      </FormField>
      <FormTextArea
        label='Comment'
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <Button content='Add Comment' labelPosition='left' icon='edit' primary />
      <Button
        onClick={() => deleteComments.mutate()}
        content='Delete All Comments'
        labelPosition='left'
        icon='trash'
        negative
      />
    </Form>
  );
};

export default CommentForm;
