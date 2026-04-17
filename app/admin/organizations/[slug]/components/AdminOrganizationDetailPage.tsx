'use client'

import React, { ChangeEvent, useState } from 'react'
import AdminWrapper from 'app/admin/shared/AdminWrapper'
import { clientRequest } from 'gpApi/typed-request'
import { AdminOrganization } from 'gpApi/api-endpoints'
import DistrictPicker from 'app/onboarding/[slug]/[step]/components/districts/DistrictPicker'
import { useMutation } from '@tanstack/react-query'
import { useSnackbar } from 'helpers/useSnackbar'
import { dateUsHelper } from 'helpers/dateHelper'
import {
  Badge,
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@styleguide'
import { CircleCheck } from 'lucide-react'
import { useImpersonateUser } from '@shared/hooks/useImpersonateUser'
import Checkbox from '@shared/inputs/Checkbox'

const Field = ({
  label,
  value,
}: {
  label: string
  value: string | null | undefined
}) => (
  <div>
    <span className="text-gray-500">{label}: </span>
    <strong>{value || 'N/A'}</strong>
  </div>
)

export const AdminOrganizationDetailPage = ({
  organization: org,
}: {
  organization: AdminOrganization
}) => {
  const { successSnackbar, errorSnackbar } = useSnackbar()
  const { impersonate } = useImpersonateUser()
  const [excludeInvalidOverride, setExcludeInvalidOverride] = useState(false)

  const mutation = useMutation({
    mutationFn: (mutationParams: {
      slug: string
      overrideDistrictId: string | null
    }) =>
      clientRequest('PATCH /v1/organizations/admin/:slug', mutationParams).then(
        (res) => res.data,
      ),
    onSuccess: () => {
      successSnackbar('District override saved. Refreshing to show changes.')
      window.location.reload()
    },
    onError: (error) => {
      errorSnackbar(error.message)
    },
  })

  const details = org.extra.campaign?.details
  const state = details?.state || ''
  const electionYear = details?.electionDate
    ? new Date(details.electionDate).getFullYear()
    : new Date().getFullYear()

  const fullName = [org.extra.owner.firstName, org.extra.owner.lastName]
    .filter(Boolean)
    .join(' ')

  return (
    <AdminWrapper
      pathname="/admin/organizations"
      title={`${fullName}: ${org.name}`}
    >
      <div className="max-w-4xl">
        <div className="border rounded-lg p-4 mb-4 bg-white">
          <div className="flex justify-between items-center mb-2">
            <h3>Organization</h3>
            <Button
              size="xSmall"
              variant={'secondary'}
              onClick={async () => {
                successSnackbar('Impersonating user')
                const ok = await impersonate(org.extra.owner.email)
                if (ok) {
                  window.location.href = '/dashboard'
                } else {
                  errorSnackbar('Impersonate failed')
                }
              }}
            >
              Impersonate User
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-2 text-sm">
            {org.electedOfficeId && (
              <Field label="Elected Office ID" value={org.electedOfficeId} />
            )}
            {org.campaignId && (
              <Field label="Campaign ID" value={String(org.campaignId)} />
            )}
            <Field label="User ID" value={org.extra.owner.id} />
            <Field label="Name" value={fullName} />
            <Field label="Email" value={org.extra.owner.email} />
          </div>
        </div>
        <div className="border rounded-lg p-4 mb-4 bg-white">
          <h3 className="mb-2">
            {org.electedOfficeId ? 'Elected Office' : 'Campaign'}
          </h3>
          <div className="grid grid-cols-1 gap-2 text-sm">
            <Field
              label="Position"
              value={org.extra.positionName || 'Unknown Position'}
            />
            {details && (
              <>
                <Field label="State" value={details.state} />
                <Field label="City" value={details.city} />
                <Field
                  label="Election Date"
                  value={dateUsHelper(details.electionDate)}
                />
                <Field label="Ballot Level" value={details.ballotLevel} />
              </>
            )}
          </div>
        </div>
        <div className="border rounded-lg p-4 mb-4 bg-white">
          <div className="flex justify-between items-center mb-1">
            <h3>District</h3>
            <Tooltip>
              {org.extra.hasDistrictOverride ? (
                <>
                  <TooltipTrigger asChild>
                    <Button
                      size="small"
                      variant="outline"
                      onClick={() => {
                        mutation.mutate({
                          slug: org.slug,
                          overrideDistrictId: null,
                        })
                      }}
                    >
                      Reset To Default
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-center">
                      We are currently using a manual override district match
                      for this position.
                      <br />
                      Click to reset to the natural district match.
                    </p>
                  </TooltipContent>
                </>
              ) : (
                <>
                  <TooltipTrigger asChild>
                    <Badge variant="outline">
                      <CircleCheck color="green" /> No District Override
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      We are currently using the natural district match for this
                      position.
                    </p>
                  </TooltipContent>
                </>
              )}
            </Tooltip>
          </div>
          {org.campaignId && (
            <div className="flex items-center gap-3">
              <Checkbox
                defaultChecked={excludeInvalidOverride}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setExcludeInvalidOverride(e.target.checked)
                }
                color="error"
              />
              <div className="text-sm">
                excludeInvalid override - only check this if you aren&apos;t
                seeing districts, and/or you&apos;re confident you can select
                the correct one without safeguards for validity. Any districts
                you see exclusively with this override we do not have a
                projected turnout for.
              </div>
            </div>
          )}
          <DistrictPicker
            state={state}
            electionYear={electionYear}
            className="max-w-4xl grid lg:grid-cols-2 gap-6 mt-6"
            buttonText="Save District"
            excludeInvalidOverride={!!org.campaignId && excludeInvalidOverride}
            onSubmit={async (_, name) => {
              if (!name.id) {
                errorSnackbar(
                  'This district has no ID. Contact an engineer via the #bugs Slack channel.',
                )
                return
              }
              await mutation.mutateAsync({
                slug: org.slug,
                overrideDistrictId: name.id,
              })
            }}
            initialType={
              org.district
                ? {
                    L2DistrictType: org.district.l2Type,
                    label: org.district.l2Type.replace(/_/g, ' '),
                  }
                : null
            }
            initialName={
              org.district
                ? {
                    id: org.district.id,
                    L2DistrictName: org.district.l2Name,
                  }
                : null
            }
          />
        </div>
      </div>
    </AdminWrapper>
  )
}
