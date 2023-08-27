'use client';
import React, { useState, useRef, useEffect, useMemo } from 'react';
import JoditEditor from 'jodit-react';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

export default function RichEditor({
  initialText = '',
  onChangeCallback = () => {},
  useOnChange = false,
}) {
  const editor = useRef(null);
  const [content, setContent] = useState('');
  useEffect(() => {
    if (content !== initialText && initialText !== null) {
      setContent(initialText);
    }
  }, [initialText]);

  // it is very important to memoize this config
  const config = useMemo(
    () => ({
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
    }),
    [],
  );

  const contentChanged = (value) => {
    if (value != null) {
      setContent(value);
      // console.log(value);
      onChangeCallback(value);
    }
  };

  return (
    <JoditEditor
      ref={editor}
      value={content}
      config={config}
      tabIndex={1} // tabIndex of textarea
      onChange={(newContent) => {
        if (useOnChange) {
          console.log(newContent);
          if (typeof newContent === 'string') {
            console.log('stinrg');
            contentChanged(newContent);
          } else {
            console.log('html');
            contentChanged(newContent?.target?.innerHTML);
          }
        }
      }}
      onBlur={(newContent) => {
        if (typeof newContent === 'string') {
          contentChanged(newContent);
        } else {
          // preferred to use only this option to update the content for performance reasons
          contentChanged(newContent?.target?.innerHTML);
        }
      }}
    />
  );
}
