interface WebsiteEditorPageCaptionProps {
  children: React.ReactNode
}

export default function WebsiteEditorPageCaption({ children }: WebsiteEditorPageCaptionProps): React.JSX.Element {
  return (
    <span className="inline-block text-xs text-gray-500 mt-2">{children}</span>
  )
}


