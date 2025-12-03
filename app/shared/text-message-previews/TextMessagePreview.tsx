import React from 'react'
import './TextMessagePreview.css'

interface TextMessagePreviewProps {
    message: string
}

export default function TextMessagePreview({ message }: TextMessagePreviewProps): React.JSX.Element {
    return (
        <div className="imessage">
            {message}
        </div>
    )
}