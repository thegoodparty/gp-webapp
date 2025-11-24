export {}

import { GooglePlacesApiResponse } from 'src/shared/types/GooglePlaces.types'

declare global {
  export namespace PrismaJson {
    export interface WebsiteContent {
      logo?: string
      theme?: string
      main?: {
        title?: string
        tagline?: string
        image?: string
      }
      about?: {
        bio?: string
        issues?: Array<{
          title?: string
          description?: string
        }>
        committee?: string
      }
      contact?: {
        address?: string
        addressPlace?: GooglePlacesApiResponse
        email?: string
        phone?: string
      }
    }
  }
}
