import React, { createContext, useContext, useState } from 'react';
import { Response } from '@interfaces/Response';
import { api } from '@service/index';
import { ItemList } from '@interfaces/ItemList';
import { SavedComment } from '@interfaces/SavedComment';
import { ReadComments } from '@interfaces/ReadComments';

type ListProps = {
  page?: number;
  size?: number;
  filter?: { start: string | null; end: string | null };
};

type CommentsContextData = {
  list: (
    listProps: ListProps,
    patientId: string
  ) => Promise<Response<ItemList<ReadComments>>>;
  create: (
    appointmentId: string,
    text: string
  ) => Promise<Response<SavedComment>>;
  generatePDF: (appointmentId: string) => Promise<string>;
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

  const list = async (
    listProps: ListProps,
    patientId: string
  ): Promise<Response<ItemList<ReadComments>>> => {
    const { size, page, filter } = listProps;
    const { data }: { data: Response<ItemList<ReadComments>> } = await api.post(
      `comments/search/${patientId}?page=${page}&size=${size}`,
      {
        appointmentDate: {
          ...filter,
        },
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

  const generatePDF = async (appointmentId: string): Promise<string> => {
    const { data }: { data: BlobPart } = await api.get(
      `comments/pdf/${appointmentId}`,
      {
        responseType: 'arraybuffer',
      }
    );

    const file = new Blob([data], { type: 'application/pdf' });

    const fileURL = URL.createObjectURL(file);

    return fileURL;
  };

  return (
    <CommentsContext.Provider
      value={{
        list,
        create,
        comments,
        generatePDF,
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
