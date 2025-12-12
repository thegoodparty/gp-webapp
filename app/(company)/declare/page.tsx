import pageMetaData from 'helpers/metadataHelper'
import DeclarePage from './components/DeclarePage'
import { Libre_Baskerville, Tangerine } from 'next/font/google'
import { apiRoutes } from 'gpApi/routes'
import { unAuthFetch } from 'gpApi/unAuthFetch'

export const revalidate = 3600
export const dynamic = 'force-static'

const baskerville = Libre_Baskerville({
  weight: ['400', '700'],
  subsets: ['latin'],
})

const tangerine = Tangerine({
  weight: ['400', '700'],
  subsets: ['latin'],
})

interface SignaturesResponse {
  signatures?: string
}

async function fetchSignatures() {
  return await unAuthFetch<SignaturesResponse>(apiRoutes.homepage.declarationSignatures.list.path)
}

const meta = pageMetaData({
  title: 'Declaration of Independence | GoodParty.org',
  description:
    'Help us make history by signing the GoodParty.org Declaration of Independence.',
  slug: '/declare',
  image: 'https://assets.goodparty.org/signature.png',
})
export const metadata = meta

export default async function Page(): Promise<React.JSX.Element> {
  const { signatures } = await fetchSignatures()
  const childProps = {
    signatures: signatures || '',
    baskerville,
    tangerine,
  }

  return <DeclarePage {...childProps} />
}
