'use client';
import React, { useState, useRef, useEffect } from 'react';

import JoditEditor from 'jodit-react';
import gpApi from 'gpApi';
import { getCookie } from 'helpers/cookieHelper';

export default function JoditEditorWrapper({
  initialText = '',
  onChangeCallback = () => {},
}) {
  const editor = useRef(null);
  const [content, setContent] = useState('');
  const token = getCookie('token');
  useEffect(() => {
    if (content !== initialText) {
      setContent(initialText);
    }
  }, [initialText]);

  const config = {
    readonly: false, // all options from https://xdsoft.net/jodit/doc/
    enableDragAndDropFileToEditor: true,
    filebrowser: {
      ajax: {
        url: gpApi.admin.uploadedImages.url,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      uploader: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        url: gpApi.admin.uploadImage.url,
      },
    },
    uploader: {
      url: gpApi.admin.uploadImage.url,
      format: 'json',
      pathVariableName: 'path',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  };

  const onBlur = (value) => {
    setContent(value);
    // console.log(value);
    onChangeCallback(value);
  };

  return (
    <JoditEditor
      ref={editor}
      value={content}
      config={config}
      tabIndex={1} // tabIndex of textarea
      onBlur={(newContent) => {
        if (typeof newContent === 'string') {
          onBlur(newContent);
        } else {
          // preferred to use only this option to update the content for performance reasons
          onBlur(newContent?.target?.innerHTML);
        }
      }}
    />
  );
}
