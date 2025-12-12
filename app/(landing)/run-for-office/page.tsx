import pageMetaData from 'helpers/metadataHelper'
import RunForOfficePage from './components/RunForOfficePage'
import { fetchContentByType } from 'helpers/fetchHelper'

export const revalidate = 3600
export const dynamic = 'force-static'

const meta = pageMetaData({
  title: 'Campaign Tools',
  description:
    'We help independent-minded people who want to get things done run for office. Chat with an expert to learn how.',
  slug: '/run-for-office',
  image: 'https://assets.goodparty.org/run-og.png',
})

export const metadata = meta

interface Testimonial {
  name: string
  office: string
  image: {
    url: string
    alt: string
  }
  testimonial: string
}

export default async function Page(): Promise<React.JSX.Element> {
  const testimonials = (await fetchContentByType(
    'candidateTestimonials',
  )) as Testimonial[]

  return <RunForOfficePage testimonials={testimonials} />
}
