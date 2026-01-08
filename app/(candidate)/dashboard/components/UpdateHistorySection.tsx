'use client'
import UserAvatar from '@shared/user/UserAvatar'
import { dateUsHelper } from 'helpers/dateHelper'
import { Fragment, memo, useState } from 'react'
import Actions from './Actions'
import Paper from '@shared/utils/Paper'
import H2 from '@shared/typography/H2'
import Body2 from '@shared/typography/Body2'
import Overline from '@shared/typography/Overline'
import H5 from '@shared/typography/H5'
import { numberFormatter } from 'helpers/numberHelper'
import H3 from '@shared/typography/H3'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import { useVoterContacts } from '@shared/hooks/useVoterContacts'
import { VoterContactsState } from '@shared/hooks/VoterContactsProvider'
import { useCampaignUpdateHistory } from '@shared/hooks/useCampaignUpdateHistory'
import {
  CampaignUpdateHistoryWithUser,
  CampaignUpdateHistoryType,
} from '@shared/hooks/CampaignUpdateHistoryProvider'
import { segregateItemFromList } from '@shared/utils/segregateItemFromList'
import { deleteUpdateHistory } from '@shared/utils/campaignUpdateHistoryServices'

interface FieldConfig {
  title: string
}

const fields: Partial<Record<CampaignUpdateHistoryType, FieldConfig>> = {
  doorKnocking: { title: 'Doors knocked' },
  text: { title: 'Texts sent' },
  calls: { title: 'Calls made' },
  yardSigns: { title: 'Yard signs' },
  digital: { title: 'Digital Ads' },
  directMail: { title: 'Direct mail sent' },
  digitalAds: { title: 'Digital ads' },
  events: { title: 'Events Attendance' },
  robocall: { title: 'Robocalls' },
  phoneBanking: { title: 'Phone Banking' },
  socialMedia: { title: 'Social Media Views' },
}

interface MassagedHistoryItem {
  id: number
  name: string
  user: CampaignUpdateHistoryWithUser['user']
  type: CampaignUpdateHistoryType
  quantity: number
  createdAt: Date
}

const massageHistoryItem = (
  historyItem: CampaignUpdateHistoryWithUser,
): MassagedHistoryItem => ({
  id: historyItem.id,
  name: historyItem.user?.firstName
    ? `${historyItem.user.firstName} ${historyItem.user.lastName}`
    : '',
  user: historyItem.user,
  type: historyItem.type,
  quantity: historyItem.quantity,
  createdAt: new Date(historyItem.createdAt),
})

const isVoterContactKey = (key: string): key is keyof VoterContactsState =>
  key in {
    doorKnocking: true,
    calls: true,
    digital: true,
    directMail: true,
    digitalAds: true,
    text: true,
    events: true,
    robocall: true,
    phoneBanking: true,
    socialMedia: true,
  }

const UpdateHistorySection = memo(function UpdateHistorySection(): React.JSX.Element {
  const [reportedVoterGoals, setReportedVoterGoals] = useVoterContacts()
  const [updateHistory, setUpdateHistory] = useCampaignUpdateHistory()
  const [showMenu, setShowMenu] = useState<string | number | boolean>(0)

  const historyItems: MassagedHistoryItem[] = !updateHistory
    ? []
    : updateHistory.map(massageHistoryItem)

  function handleShowMenu(id: string | number | boolean): void {
    trackEvent(EVENTS.Dashboard.ActionHistory.ClickMenu, { id })
    setShowMenu(id)
  }

  const handleDelete = async (id: string): Promise<void> => {
    const numId = parseInt(id, 10)
    const [deletedItem, restItems] = segregateItemFromList(
      updateHistory,
      ({ id: itemId }) => itemId === numId,
    )
    await deleteUpdateHistory(numId)
    setUpdateHistory(restItems)
    const typeKey = deletedItem!.type
    if (isVoterContactKey(typeKey)) {
      setReportedVoterGoals(() => ({
        ...reportedVoterGoals,
        [typeKey]: Math.max(
          reportedVoterGoals[typeKey] - deletedItem!.quantity,
          0,
        ),
      }))
    }
  }

  return (
    <Paper className="mt-12">
      <div className="">
        <H2>Campaign Action History</H2>
        <Body2 className="mb-4 text-gray-600">
          View all recorded progress entries for your campaign below.
        </Body2>
        {historyItems.length === 0 ? (
          <Paper>
            <div className="flex flex-col justify-center items-center py-4">
              <div className="text-4xl">
                <span role="img" aria-label="Frowning Face">
                  ☹️
                </span>
              </div>
              <H3 className="mt-4">
                You do not have any campaign history yet.
              </H3>
            </div>
          </Paper>
        ) : (
          <>
            <div className="grid grid-cols-12  bg-black text-white rounded-t-lg">
              <div className="col-span-8 md:col-span-4 lg:col-span-3">
                <Overline className="p-4 pl-10">Method</Overline>
              </div>

              <div className="hidden lg:block lg:col-span-3">
                <Overline className=" p-4">User</Overline>
              </div>

              <div className="col-span-4 md:col-span-4 lg:col-span-3">
                <Overline className=" p-4"># Records</Overline>
              </div>

              <div className="hidden md:block md:col-span-4 lg:col-span-3">
                <Overline className=" p-4">Date Added</Overline>
              </div>
            </div>
            <div className="grid grid-cols-12 rounded-b-lg">
              {historyItems.map((item, index) => (
                <Fragment key={item.id}>
                  <div
                    className={`col-span-8 md:col-span-4 lg:col-span-3 flex items-center p-2 border-b border-gray-200 ${
                      index % 2 === 0 ? '' : 'bg-gray-50'
                    } border-l`}
                  >
                    <Actions
                      id={String(item.id)}
                      actionName={`${numberFormatter(item.quantity)} ${
                        fields[item.type]?.title || item.type
                      }`}
                      showMenu={showMenu}
                      setShowMenu={handleShowMenu}
                      deleteHistoryCallBack={handleDelete}
                    />
                    <H5 className="ml-3">{fields[item.type]?.title || item.type}</H5>
                  </div>

                  <div
                    className={`hidden lg:flex lg:col-span-3 p-2 border-b  items-center  border-gray-200 ${
                      index % 2 === 0 ? '' : 'bg-gray-50'
                    }`}
                  >
                    <UserAvatar user={item.user} size="small" />{' '}
                    &nbsp; {item.name}
                  </div>

                  <div
                    className={`col-span-4 md:col-span-4 lg:col-span-3 p-2 border-b border-gray-200 flex items-center  border-r md:border-r-0 ${
                      index % 2 === 0 ? '' : 'bg-gray-50'
                    }`}
                  >
                    <H5>{numberFormatter(item.quantity)}</H5>
                  </div>

                  <div
                    className={`hidden md:flex items-center md:col-span-4 lg:col-span-3 p-2 border-b border-gray-200 md:border-r ${
                      index % 2 === 0 ? '' : 'bg-gray-50'
                    }`}
                  >
                    <H5>{dateUsHelper(item.createdAt)}</H5>
                  </div>
                </Fragment>
              ))}
            </div>
          </>
        )}
      </div>
    </Paper>
  )
})

export default UpdateHistorySection
