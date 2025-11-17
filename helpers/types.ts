/**
 * Shared type definitions for helper utilities
 */

export interface User {
  id: string
  email: string
  [key: string]: unknown
}

export interface UserResponse {
  data: User
}

