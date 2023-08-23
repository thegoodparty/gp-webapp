'use client';
import { useState } from 'react';
import { CopyToClipboard as CopyHelper } from 'react-copy-to-clipboard';

export default function CopyToClipboard({ children, text }) {
  const [copied, setCopied] = useState(false);

  const onCopyHandler = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div>
      <CopyHelper text={text} onCopy={onCopyHandler}>
        <div>{children}</div>
      </CopyHelper>
      {copied && (
        <div className="h-2 mt-2 text-xs text-red-700 text-center">Copied.</div>
      )}
    </div>
  );
}
