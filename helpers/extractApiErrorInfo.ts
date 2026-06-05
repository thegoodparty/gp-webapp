export interface ApiErrorInfo {
  message?: string
  errorCode?: string
}

export const extractApiErrorInfo = (data: unknown): ApiErrorInfo => {
  if (!data || typeof data !== 'object') return {}
  const record = data as Record<string, unknown>
  const rawMessage = record.message
  const message =
    typeof rawMessage === 'string'
      ? rawMessage
      : Array.isArray(rawMessage)
      ? rawMessage.filter((m) => typeof m === 'string').join(', ')
      : undefined
  const errorCode =
    typeof record.errorCode === 'string' ? record.errorCode : undefined
  return { message, errorCode }
}
