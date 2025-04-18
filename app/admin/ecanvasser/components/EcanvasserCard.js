'use client'
import Button from '@shared/buttons/Button'
import Body1 from '@shared/typography/Body1'
import Body2 from '@shared/typography/Body2'
import H3 from '@shared/typography/H3'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import { dateWithTime } from 'helpers/dateHelper'
import { numberFormatter } from 'helpers/numberHelper'
import { useState } from 'react'
import { syncEcanvasser } from 'utils/syncEcanvasser'

const deleteEcanvasser = async (campaignId) => {
  const payload = {
    campaignId,
  }
  return await clientFetch(apiRoutes.ecanvasser.delete, payload)
}

export default function EcanvasserCard({ ecanvasser, onUpdate }) {
  const [isLoading, setIsLoading] = useState(false)
  const { email, contacts, houses, interactions, lastSync, error } = ecanvasser

  const attr = [
    { label: 'Contacts', value: contacts },
    { label: 'Houses', value: houses },
    { label: 'Interactions', value: interactions },
  ]

  const handleSync = async () => {
    setIsLoading(true)
    await syncEcanvasser(ecanvasser.campaignId, true)
    setIsLoading(false)
    onUpdate()
  }

  const handleDelete = async () => {
    setIsLoading(true)
    await deleteEcanvasser(ecanvasser.campaignId)
    setIsLoading(false)
    onUpdate()
  }

  return (
    <div className="col-span-12 md:col-span-6 lg:col-span-4">
      <div className="p-4 shadow-md rounded-xl border border-gray-200">
        <H3 className="mb-4">{email}</H3>
        {attr.map((attr) => (
          <div className="grid grid-cols-12 gap-2 mt-2" key={attr.label}>
            <Body2 className="col-span-8 font-semibold">{attr.label}</Body2>
            <Body2 className="col-span-4">
              {attr.value || attr.value === 0
                ? numberFormatter(attr.value)
                : 'n/a'}
            </Body2>
          </div>
        ))}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <Body1 className="text-sm text-gray-500">
            Last Sync: {lastSync ? dateWithTime(lastSync) : 'n/a'}
          </Body1>
          {error && (
            <Body1 className="text-sm text-red-500 mt-2">
              Sync error: {error}
            </Body1>
          )}
        </div>
        <div className="mt-4">
          <Button color="primary" className="w-full" onClick={handleSync}>
            Re-sync
          </Button>
        </div>
        <div className="mt-4">
          <Button
            color="error"
            className="w-full"
            onClick={handleDelete}
            disabled={isLoading}
          >
            Delete Ecanvasser Integration
          </Button>
        </div>
      </div>
    </div>
  )
}
