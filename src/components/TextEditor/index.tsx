import React, { useState } from 'react';
import 'quill/dist/quill.snow.css';
import { Container, Content, StyledButton } from './style';
import { CircularProgress } from '@mui/material';
import ReactQuill from 'react-quill';

type TextEditorProps = {
  saveComment?: (text: string) => Promise<void>;
  comment?: string;
  readOnly?: boolean;
};

const TextEditor = ({
  saveComment,
  comment,
  readOnly,
}: TextEditorProps): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(false);
  const [value, setValue] = useState<string>(comment ? comment : '');

  console.log('CONSOLE', comment);

  const onSubmit = async (): Promise<void> => {
    if (saveComment) {
      setLoading(true);
      await saveComment((value === '<p><br></p>' ? '' : value) || '');
      setLoading(false);
    }
  };

  return (
    <Container>
      <Content>
        <div>
          <div id="toolbar">
            <select
              className="ql-size"
              defaultValue="medium"
              style={{ marginLeft: 10 }}
              disabled={readOnly}
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
              <button disabled={readOnly} className="ql-bold" />
              <button disabled={readOnly} className="ql-italic" />
              <button disabled={readOnly} className="ql-underline" />
              <button disabled={readOnly} className="ql-strike" />
            </span>
            <span className="ql-formats">
              <button disabled={readOnly} className="ql-list" value="ordered" />
              <button disabled={readOnly} className="ql-list" value="bullet" />
            </span>
            <span className="ql-formats">
              <select
                disabled={readOnly}
                style={{ marginLeft: 10 }}
                className="ql-align"
              />
              <select
                disabled={readOnly}
                style={{ marginLeft: 10 }}
                className="ql-color"
              />
              <select disabled={readOnly} className="ql-background" />
            </span>
          </div>
          <ReactQuill
            style={{
              height: '80%',
              maxHeight: '70%',
              width: '100%',
              fontFamily: 'Poppins',
              fontSize: '1.2rem',
            }}
            modules={{
              toolbar: {
                container: '#toolbar',
              },
            }}
            value={value}
            onChange={setValue}
            readOnly={readOnly}
          />
        </div>

        <StyledButton disabled={loading || readOnly} onClick={onSubmit}>
          {loading ? (
            <CircularProgress style={{ color: '#FFF' }} size={20} />
          ) : comment ? (
            'SALVAR'
          ) : (
            'CONCLUIR'
          )}
        </StyledButton>
      </Content>
    </Container>
  );
};

export default TextEditor;
