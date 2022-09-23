import React, { createContext, useContext, useState } from 'react';
import { Response } from '@interfaces/Response';
import { api } from '@service/index';
import { SearchFilter } from '@interfaces/SearchFilter';
import { ItemList } from '@interfaces/ItemList';
import { SavedComment } from '@interfaces/SavedComment';
import { ReadComments } from '@interfaces/ReadComments';

type ListProps = {
  page?: number;
  size?: number;
  filter?: SearchFilter;
};

type CommentsContextData = {
  list: (listProps: ListProps) => Promise<Response<ItemList<ReadComments>>>;
  create: (
    appointmentId: string,
    text: string
  ) => Promise<Response<SavedComment>>;
  comments: ReadComments[];
  count: number;
};

type CommentsProviderProps = {
  children: React.ReactElement;
};

const CommentsContext = createContext<CommentsContextData>(
  {} as CommentsContextData
);

export const CommentsProvider: React.FC<CommentsProviderProps> = ({
  children,
}: CommentsProviderProps) => {
  const [comments, setComments] = useState<ReadComments[]>([]);
  const [count, setCount] = useState<number>(0);

  const list = async ({
    size,
    page,
    filter,
  }: ListProps): Promise<Response<ItemList<ReadComments>>> => {
    const { data }: { data: Response<ItemList<ReadComments>> } = await api.post(
      page && size
        ? `professional/search?page=${page}&size=${size}`
        : 'professional/search',
      {
        ...filter,
      }
    );

    setComments(data.content?.items as ReadComments[]);
    setCount(data.content?.totalItems || 0);

    return data;
  };

  const create = async (
    appointmentId: string,
    text: string
  ): Promise<Response<SavedComment>> => {
    const { data }: { data: Response<SavedComment> } = await api.post(
      `comments/${appointmentId}`,
      {
        text,
        blankComments: text.length === 0,
      }
    );

    return data;
  };

  return (
    <CommentsContext.Provider
      value={{
        list,
        create,
        comments,
        count,
      }}
    >
      {children}
    </CommentsContext.Provider>
  );
};

export const useComments = (): CommentsContextData => {
  const context = useContext(CommentsContext);

  if (!context) {
    throw new Error('Este hook deve ser utilizado dentro de seu provider');
  }

  return context;
};