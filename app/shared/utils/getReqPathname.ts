import { headers } from 'next/headers'

export const getReqPathname = async (): Promise<string | null> => {
  const headersList = await headers()
  return headersList.get('x-pathname')
}

