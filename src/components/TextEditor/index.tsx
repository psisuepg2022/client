import React from 'react';
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css'; // Add css for snow theme
import { QuillOptionsStatic } from 'quill';
import { Container, Content, StyledButton } from './style';
import { CircularProgress } from '@mui/material';
// or import 'quill/dist/quill.bubble.css'; // Add css for bubble theme

const options: QuillOptionsStatic = {
  modules: {
    toolbar: '#toolbar',
    // [
    //   ['bold', 'italic', 'underline', 'strike'], // toggled buttons

    //   [{ header: 1 }, { header: 2 }, { header: 3 }], // custom button values
    //   [{ list: 'ordered' }, { list: 'bullet' }],
    //   [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
    //   [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
    //   [{ direction: 'rtl' }], // text direction

    //   [{ size: ['large', 'huge'] }], // custom dropdown
    //   // [{ header: [1, 2, 3, 4, 5, 6, false] }],

    //   [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    //   [{ align: [] }],
    // ],
  },
};

type TextEditorProps = {
  saveComment: (text: string) => Promise<void>;
  loading: boolean;
};

const TextEditor = ({ saveComment, loading }: TextEditorProps): JSX.Element => {
  const { quill, quillRef } = useQuill(options);

  console.log(quill); // undefined > Quill Object
  console.log(quillRef); // { current: undefined } > { current: Quill TextEditor Reference }

  const onSubmit = async (): Promise<void> => {
    const data = quill?.root.innerHTML;

    await saveComment((data === '<p><br></p>' ? '' : data) || '');
  };

  return (
    <Container>
      <Content>
        <div id="toolbar">
          <select className="ql-size" style={{ marginLeft: 10 }}>
            <option value="small">Pequena</option>
            <option selected>Média</option>
            <option value="large">Grande</option>
            <option value="huge">Enorme</option>
          </select>
          <span
            className="ql-formats"
            style={{ marginLeft: 10, marginRight: 10 }}
          >
            <button className="ql-bold" />
            <button className="ql-italic" />
            <button className="ql-underline" />
            <button className="ql-strike" />
          </span>
          <span className="ql-formats">
            <button className="ql-list" value="ordered" />
            <button className="ql-list" value="bullet" />
          </span>
          <span className="ql-formats">
            <select style={{ marginLeft: 10 }} className="ql-align" />
            <select style={{ marginLeft: 10 }} className="ql-color" />
            <select className="ql-background" />
          </span>
        </div>
        <div
          style={{
            height: '80%',
            width: '100%',
            fontFamily: 'Poppins',
            fontSize: '1.2rem',
          }}
          ref={quillRef}
        />
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
