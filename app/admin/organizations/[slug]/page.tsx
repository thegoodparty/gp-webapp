import { adminAccessOnly } from 'helpers/permissionHelper'
import { AdminOrganizationDetailPage } from './components/AdminOrganizationDetailPage'
import pageMetaData from 'helpers/metadataHelper'
import { serverRequest } from 'gpApi/server-request'
import { notFound } from 'next/navigation'

export const metadata = pageMetaData({
  title: 'Organization Detail | GoodParty.org',
  description: 'Admin Organization Detail',
  slug: '/admin/organizations',
})

export default async function Page({
  params,
}: PageProps<'/admin/organizations/[slug]'>): Promise<React.JSX.Element> {
  await adminAccessOnly()

  const { slug } = await params

  const response = await serverRequest('GET /v1/organizations/admin/list', {
    slug,
  })

  const organization = response.data.organizations.find(
    (org) => org.slug === slug,
  )

  if (!organization) {
    return notFound()
  }

  return <AdminOrganizationDetailPage organization={organization} />
}
