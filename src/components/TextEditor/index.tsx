import React from 'react';
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css'; // Add css for snow theme
import { QuillOptionsStatic } from 'quill';
import { Container, Content, StyledButton } from './style';
import { CircularProgress } from '@mui/material';
// or import 'quill/dist/quill.bubble.css'; // Add css for bubble theme

const options: QuillOptionsStatic = {
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'], // toggled buttons

      [{ header: 1 }, { header: 2 }], // custom button values
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
      [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
      [{ direction: 'rtl' }], // text direction

      [{ size: ['large', 'huge'] }], // custom dropdown
      // [{ header: [1, 2, 3, 4, 5, 6, false] }],

      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ align: [] }],

      ['clean'],
    ],
  },
};

type TextEditorProps = {
  saveComment: (data: string) => Promise<void>;
  loading: boolean;
};

const TextEditor = ({ saveComment, loading }: TextEditorProps): JSX.Element => {
  const { quill, quillRef } = useQuill(options);

  console.log(quill); // undefined > Quill Object
  console.log(quillRef); // { current: undefined } > { current: Quill TextEditor Reference }

  const onSubmit = async (): Promise<void> => {
    const data = quill?.root.innerHTML;

    console.log('DATA', data);
    await saveComment(data || '');
  };

  return (
    <Container>
      <Content>
        <div style={{ height: '80%', width: '100%' }} ref={quillRef} />
        <StyledButton onClick={onSubmit}>
          {loading ? (
            <CircularProgress style={{ color: '#FFF' }} size={20} />
          ) : (
            'CONCLUIR'
          )}
        </StyledButton>
      </Content>
    </Container>
  );
};

export default TextEditor;
