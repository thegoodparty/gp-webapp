import { notFound } from 'next/navigation'
import { apiRoutes } from 'gpApi/routes'
import { serverFetch } from 'gpApi/serverFetch'
import JobPage from '../components/JobPage'
import pageMetaData from 'helpers/metadataHelper'

interface Job {
  id: string
  title: string
  descriptionPlain: string
  departmentName: string
  locationName: string
  employmentType: string
}

interface Params {
  slug: string
}

const fetchJob = async (slug: string): Promise<Job | null> => {
  try {
    const payload = {
      id: slug,
    }
    const resp = await serverFetch<Job>(apiRoutes.jobs.find, payload, {
      revalidate: 3600,
    })

    return resp.data
  } catch (e) {
    console.log('error fetching job', e)
    return null
  }
}

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = params
  const job = await fetchJob(slug)
  if (!job) {
    notFound()
  }
  const meta = pageMetaData({
    title: `${job.title} | GoodParty.org Jobs`,
    description: job.descriptionPlain.slice(0, 150) + '...',
    slug: `/work-with-us/${slug}`,
  })
  return meta
}

export default async function Page({ params }: { params: Params }): Promise<React.JSX.Element> {
  const { slug } = params
  if (!slug) {
    notFound()
  }

  const job = await fetchJob(slug)
  if (!job) {
    notFound()
  }

  const childProps = {
    slug,
    job,
  }

  return (
    <>
      <JobPage {...childProps} />
    </>
  )
}
