import React, { useEffect } from 'react';
import axios from 'axios';
import { useQuery, useQueryClient} from '@tanstack/react-query';
import {
  CommentText,
  CommentMetadata,
  CommentContent,
  CommentAvatar,
  CommentAuthor,
  Comment,
} from 'semantic-ui-react';
import { formatDateTime } from './utils/dateHelpers';

interface Comment {
  id: number;
  name: string;
  message: string;
  created: string;
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
    <>
      {comments?.map((comment) => (
        <div key={comment.id}>
          <Comment>
            <CommentAvatar
              alt='default Mailchimp logo avatar'
              src='https://i.ibb.co/QrHN4SG/mailchimp-242x256.png'
            />
            <CommentContent>
              <CommentAuthor>{comment.name}</CommentAuthor>
              <CommentMetadata>
                <div>{formatDateTime(comment.created)}</div>
              </CommentMetadata>
              <CommentText>{comment.message}</CommentText>
            </CommentContent>
          </Comment>
        </div>
      ))}
    </>
  );
};

export default CommentFeed;
