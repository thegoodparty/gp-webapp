import React from 'react'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer'
import { BLOCKS, Document } from '@contentful/rich-text-types'
import type { Options } from '@contentful/rich-text-react-renderer'

interface TextProps {
  children: React.ReactNode
}

const Text = ({ children }: TextProps) => (
  <p style={{ whiteSpace: 'pre-line' }}>{children}</p>
)

const dtrOptions: Options = {
  renderNode: {
    [BLOCKS.EMBEDDED_ASSET]: (node) => (
      <img
        src={node.data?.target?.fields?.file?.url}
        alt={node.data?.target?.fields?.title}
        className="faq-image"
      />
    ),
    [BLOCKS.PARAGRAPH]: (_node, children) => <Text>{children}</Text>,
  },
}

const contentfulHelper = (rawRichTextField: string | Document | undefined): React.ReactNode => {
  if (!rawRichTextField) return null
  try {
    let doc: Document = rawRichTextField as Document
    if (typeof rawRichTextField === 'string') {
      doc = JSON.parse(rawRichTextField) as Document
    }
    return documentToReactComponents(doc, dtrOptions)
  } catch (e) {
    console.log('error at helper')
    console.log(e)
    return ''
  }
}

export default contentfulHelper

export const cmsToPlainText = (content: Document | null | undefined, limit?: number): string => {
  if (!content) {
    return ''
  }
  const text = documentToPlainTextString(content)
  if (text && limit) {
    return text.substring(0, limit - 3) + '...'
  }
  return text
}

