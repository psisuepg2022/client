import React from 'react';
import { Event } from 'react-big-calendar';
import { useLocation } from 'react-router-dom';

const CommentCreation = (): JSX.Element => {
  const { state }: { state: Event } = useLocation() as { state: Event };

  return (
    <div>
      <h1>CRIAR COMMENT</h1>
    </div>
  );
};

export default CommentCreation;
