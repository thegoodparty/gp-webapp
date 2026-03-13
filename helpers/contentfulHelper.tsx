import React from 'react'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer'
import { BLOCKS, Document } from '@contentful/rich-text-types'
import type { Options } from '@contentful/rich-text-react-renderer'
import * as z from 'zod'

interface TextProps {
  children: React.ReactNode
}

const Text = ({ children }: TextProps) => (
  <p style={{ whiteSpace: 'pre-line' }}>{children}</p>
)

const embeddedAssetSchema = z.object({
  target: z.object({
    fields: z.object({
      file: z.object({ url: z.string() }).optional(),
      title: z.string().optional(),
    }),
  }),
})

const dtrOptions: Options = {
  renderNode: {
    [BLOCKS.EMBEDDED_ASSET]: (node) => {
      const result = embeddedAssetSchema.safeParse(node.data)
      const fields = result.success ? result.data.target.fields : undefined
      return (
        <img
          src={fields?.file?.url}
          alt={fields?.title}
          className="faq-image"
        />
      )
    },
    [BLOCKS.PARAGRAPH]: (_node, children) => <Text>{children}</Text>,
  },
}

const documentSchema = z.custom<Document>(
  (val) =>
    typeof val === 'object' &&
    val !== null &&
    'nodeType' in val &&
    'content' in val,
)

const parseJsonDocument = (raw: string): Document | null => {
  const result = documentSchema.safeParse(JSON.parse(raw))
  return result.success ? result.data : null
}

const isDocument = (
  obj: Document | string | null | undefined,
): obj is Document => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'nodeType' in obj &&
    'content' in obj
  )
}

const contentfulHelper = (
  rawRichTextField: Document | string | null | undefined,
): React.ReactNode => {
  if (!rawRichTextField) return null
  try {
    let doc: Document
    if (typeof rawRichTextField === 'string') {
      const parsed = parseJsonDocument(rawRichTextField)
      if (!parsed) return null
      doc = parsed
    } else if (isDocument(rawRichTextField)) {
      doc = rawRichTextField
    } else {
      return null
    }
    return documentToReactComponents(doc, dtrOptions)
  } catch (e) {
    console.log('error at helper')
    console.log(e)
    return ''
  }
}

export default contentfulHelper

export const cmsToPlainText = (
  content: Document | string | null | undefined,
  limit?: number,
): string => {
  if (!content) {
    return ''
  }
  try {
    let doc: Document
    if (typeof content === 'string') {
      const parsed = parseJsonDocument(content)
      if (!parsed) return ''
      doc = parsed
    } else if (isDocument(content)) {
      doc = content
    } else {
      return ''
    }
    const text = documentToPlainTextString(doc)
    if (text && limit) {
      return text.substring(0, limit - 3) + '...'
    }
    return text
  } catch {
    return ''
  }
}
