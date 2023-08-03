'use client';
import React, { useState, useRef, useEffect } from 'react';

import JoditEditor from 'jodit-react';
import gpApi from 'gpApi';
import { getCookie } from 'helpers/cookieHelper';

export default function RichEditor({
  initialText = '',
  onChangeCallback = () => {},
}) {
  const editor = useRef(null);
  const [content, setContent] = useState('');
  useEffect(() => {
    if (content !== initialText) {
      setContent(initialText);
    }
  }, [initialText]);

  const config = {
    readonly: false, // all options from https://xdsoft.net/jodit/doc/
    enableDragAndDropFileToEditor: false,
    useSearch: false,
    toolbar: false,
    showCharsCounter: false,
    showWordsCounter: false,
    showXPathInStatusbar: false,
    toolbarInlineForSelection: true,
    showPlaceholder: false,
    buttons:
      'bold,italic,underline,strikethrough,ul,ol,fontsize,paragraph,copy,paste,hr,table,print',
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
