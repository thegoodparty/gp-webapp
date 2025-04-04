import GetDemoPage from './components/GetDemoPage'
import pageMetaData from 'helpers/metadataHelper'

export const revalidate = 3600
export const dynamic = 'force-static'

const meta = pageMetaData({
  title: 'Book a Demo',
  description:
    "Book a brief 1:1 meeting with our team to learn about GoodParty.org's free tools for independent and third-party candidates. We'll cover your campaign needs, our tool's functionality. and show you the tool in action.",

  slug: '/get-a-demo',
  image: 'https://assets.goodparty.org/get-a-demo.png',
})
export const metadata = meta

export default async function Page(params) {
  return <GetDemoPage />
}
