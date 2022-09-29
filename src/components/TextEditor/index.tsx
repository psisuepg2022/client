import React, { useEffect, useState } from 'react';
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';
import { Container, Content, StyledButton } from './style';
import { CircularProgress } from '@mui/material';

type TextEditorProps = {
  saveComment?: (text: string) => Promise<void>;
  comment?: string;
};

const TextEditor = ({ saveComment, comment }: TextEditorProps): JSX.Element => {
  const { quill, quillRef } = useQuill({
    modules: {
      toolbar: '#toolbar',
    },
    readOnly: !!comment,
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (comment && quill) {
      quill.root.innerHTML = comment;
      setLoading(false);
    }
    if (!comment) {
      setLoading(false);
    }
  }, [quill]);

  const onSubmit = async (): Promise<void> => {
    const data = quill?.root.innerHTML;

    if (saveComment) {
      setLoading(true);
      await saveComment((data === '<p><br></p>' ? '' : data) || '');
      setLoading(false);
    }
  };

  return (
    <Container>
      <Content>
        <div id="toolbar" style={{ ...(comment && { display: 'none' }) }}>
          {!comment && (
            <>
              <select
                className="ql-size"
                defaultValue="medium"
                style={{ marginLeft: 10 }}
              >
                <option value="small">Pequena</option>
                <option value="medium">Média</option>
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
            </>
          )}
        </div>
        <div
          style={{
            height: '80%',
            maxHeight: '70%',
            width: '100%',
            fontFamily: 'Poppins',
            fontSize: '1.2rem',
          }}
          ref={quillRef}
        />
        {!comment && (
          <StyledButton disabled={loading} onClick={onSubmit}>
            {loading ? (
              <CircularProgress style={{ color: '#FFF' }} size={20} />
            ) : (
              'CONCLUIR'
            )}
          </StyledButton>
        )}
      </Content>
    </Container>
  );
};

export default TextEditor;
