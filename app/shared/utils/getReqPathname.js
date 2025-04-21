import { headers } from 'next/headers'

export const getReqPathname = async () => {
  const headersList = await headers()
  return headersList.get('x-pathname')
}
