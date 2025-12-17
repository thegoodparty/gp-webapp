import React from 'react'
import './TextMessagePreview.css'

interface TextMessagePreviewProps {
  message: React.ReactNode
}

export default function TextMessagePreview({
  message,
}: TextMessagePreviewProps): React.JSX.Element {
  return <div className="imessage">{message}</div>
}
