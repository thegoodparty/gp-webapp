import { ContentMedia } from '../../src/content/content.types'
import { FieldsType } from 'contentful'

export {}
declare global {
  export namespace PrismaJson {
    export type BlogArticleTag = {
      name: string
      slug: string
    }
    export type BlogArticleTags = BlogArticleTag[]
    export type BlogArticleMainImage = ContentMedia
    export type BlogArticleSection = {
      id: string
      fields:
        | {
            title: string
            subtitle: string
            slug: string
            order: number
          }
        | FieldsType
    }
    export type BlogArticleAuthor = {
      fields: {
        name: string
        summary: string
        image?: ContentMedia
      }
    }
    export type BlogArticleReference = {
      url: string
      name: string
      description: string
    }
  }
}
