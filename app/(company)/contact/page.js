import { Suspense } from 'react'
import MaxWidth from '@shared/layouts/MaxWidth'
import HubSpotForm from '../../shared/utils/HubSpotForm'
import pageMetaData from 'helpers/metadataHelper'

export const revalidate = 3600
export const dynamic = 'force-static'

const meta = pageMetaData({
  title: 'Contact | GoodParty.org',
  description: 'Have questions or want to get involved? Contact us.',
  slug: '/contact',
})
export const metadata = meta

export default function Page() {
  return (
    <MaxWidth>
      <div className="xl:max-w-5xl  mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12 mb-12">
          <div>
            <h1 className="text-5xl font-black  mb-8">
              Have questions or want to get involved?
              <br />
              <br />
              Contact us.
            </h1>
            <div className="text-xl font-bold italic">
              We&apos;ll do our best to get back to you within 24 hours.
            </div>
          </div>
          <div>
            <Suspense fallback="loading...">
              <HubSpotForm
                formId="c60165c3-704d-4cfa-a8de-d89e28f06a7c"
                gtmName="contact_form_submit"
              />
            </Suspense>
          </div>
        </div>
      </div>
    </MaxWidth>
  )
}
