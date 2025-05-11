'use client'

import AdminWrapper from 'app/admin/shared/AdminWrapper'
import PortalPanel from '@shared/layouts/PortalPanel'
import H1 from '@shared/typography/H1'
import { useAdminCampaign } from '@shared/hooks/useAdminCampaign'
import CampaignDetailsTable from './CampaignDetailsTable'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import { useState, useEffect } from 'react'
import Paper from '@shared/utils/Paper'
import H2 from '@shared/typography/H2'
import Button from '@shared/buttons/Button'
import ImpersonateAction from 'app/admin/shared/ImpersonateAction'
import DeleteAction from 'app/admin/candidates/components/DeleteAction'
import UserInfoCard from './UserInfoCard'
import { COMPLIANCE_STATUSES } from 'app/(candidate)/dashboard/text-messaging/components/TextMessagingPage'
import Body2 from '@shared/typography/Body2'
import Body1 from '@shared/typography/Body1'
import Overline from '@shared/typography/Overline'
import { useSnackbar } from 'helpers/useSnackbar'

export const COMPLIANCE_STATUS_COLORS = {
  [COMPLIANCE_STATUSES.submitted]: 'bg-info',
  [COMPLIANCE_STATUSES.pending]: 'bg-warning',
  [COMPLIANCE_STATUSES.approved]: 'bg-success',
  [COMPLIANCE_STATUSES.rejected]: 'bg-error',
  [COMPLIANCE_STATUSES.error]: 'bg-error',
}

async function fetchUser(userId) {
  return clientFetch(apiRoutes.admin.user.get, {
    id: userId,
  })
}

async function approveCompliance(campaignId, approved) {
  return clientFetch(apiRoutes.textMessaging.approveCompliance, {
    campaignId,
    approved,
  })
}

export default function AdminCampaignDetailsPage({ pathname }) {
  const [campaign, , refreshCampaign] = useAdminCampaign()
  const [user, setUser] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const { errorSnackbar, successSnackbar } = useSnackbar()

  const complianceInfo = campaign?.data?.tcrComplianceInfo

  useEffect(() => {
    async function loadUser() {
      setUser(undefined)

      const resp = await fetchUser(campaign.userId)

      if (resp.ok) {
        setUser(resp.data)
      } else {
        setUser(null)
        console.error('Error fetching user', resp)
      }
    }

    loadUser()
  }, [campaign])

  async function handleApproveOrReject(shouldApprove) {
    setIsLoading(true)
    const resp = await approveCompliance(campaign.id, shouldApprove)

    if (resp.ok) {
      successSnackbar('Compliance status updated')
    } else {
      errorSnackbar('Error updating compliance status')
    }

    refreshCampaign()
    setIsLoading(false)
  }

  return (
    <AdminWrapper pathname={pathname} title={'Campaign Details'}>
      <PortalPanel color="#2CCDB0">
        <H1>Campaign Details: {campaign?.slug}</H1>

        <div className="flex gap-4 mt-6 mb-6">
          <UserInfoCard user={user} />
          <Paper className="flex-grow">
            <H2 className="mb-4">Compliance Info</H2>
            {!complianceInfo ? (
              <Body2>TCR Compliance not started</Body2>
            ) : (
              <Body2>
                <div className="mb-8">
                  <Overline className="mb-4">
                    Status:{' '}
                    <span
                      className={`font-semibold rounded-md px-2 py-1 ${
                        COMPLIANCE_STATUS_COLORS[complianceInfo.status]
                      }`}
                    >
                      {complianceInfo.status}
                    </span>
                  </Overline>
                  View <span className="font-bold">tcrComplianceInfo</span>{' '}
                  field in table below for full details.
                </div>

                {complianceInfo.status !== COMPLIANCE_STATUSES.pending && (
                  <Body1 className="!font-bold">
                    Must be in pending status to manually approve
                  </Body1>
                )}
                <div className="flex gap-4">
                  <Button
                    color="success"
                    onClick={() => handleApproveOrReject(true)}
                    disabled={
                      complianceInfo.status !== COMPLIANCE_STATUSES.pending ||
                      isLoading
                    }
                    loading={isLoading}
                  >
                    Mark as approved
                  </Button>

                  <Button
                    color="error"
                    onClick={() => handleApproveOrReject(false)}
                    disabled={
                      complianceInfo.status !== COMPLIANCE_STATUSES.pending ||
                      isLoading
                    }
                    loading={isLoading}
                  >
                    Mark as rejected
                  </Button>
                </div>
              </Body2>
            )}
          </Paper>
          <Paper>
            <H2>Campaign Actions</H2>
            <div className="mt-4 flex flex-col gap-2 items-center">
              <Button
                href={`/admin/victory-path/${campaign?.slug}`}
                size="small"
                className="w-full font-semibold"
                color="secondary"
              >
                Path to Victory
              </Button>
              <ImpersonateAction
                email={user?.email}
                isCandidate={true}
                launched={campaign?.launched}
              />

              <DeleteAction
                id={campaign?.id}
                slug={campaign?.slug}
                isLive={campaign?.isLive}
              />
            </div>
          </Paper>
        </div>

        <div className="mt-6">
          <CampaignDetailsTable campaign={campaign} />
        </div>
      </PortalPanel>
    </AdminWrapper>
  )
}
