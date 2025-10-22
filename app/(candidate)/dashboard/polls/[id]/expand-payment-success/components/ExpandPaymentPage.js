'use client'

import PollsPageGuard from '../../../components/PollsPageGuard'
import Paper from '@shared/utils/Paper'
import H1 from '@shared/typography/H1'
import { Card, CardContent } from 'goodparty-styleguide'
import CongratulationsAnimation from '@shared/animations/CongratulationsAnimation'
import { LuSmartphone } from 'react-icons/lu'
import Body1 from '@shared/typography/Body1'
import { dateUsHelper } from 'helpers/dateHelper'
import { PRICE_PER_MESSAGE } from '../../../shared/constants'
import { numberFormatter } from 'helpers/numberHelper'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const REDIRECT_URL = '/dashboard/polls'
const REDIRECT_DELAY = 4 * 1000

export default function ExpandPaymentSuccessPage({ count }) {
  const router = useRouter()
  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push(REDIRECT_URL)
    }, REDIRECT_DELAY)
    return () => clearTimeout(timeout)
  }, [])
  return (
    <div className="bg-indigo-100 min-h-screen p-4 md:p-8">
      <PollsPageGuard>
        <Paper className="min-h-full max-w-[700px] mx-auto mt-8 md:mt-16 lg:p-12">
          <div className="relative h-40 w-40 mx-auto">
            <CongratulationsAnimation loop />
          </div>
          <H1 className="text-center mb-8">Payment successful!</H1>
          <Card>
            <CardContent>
              <div className="flex  items-center gap-2">
                <div className="bg-green-100 flex items-center justify-center rounded-full w-12 h-12">
                  <LuSmartphone size={24} />
                </div>
                <div>
                  <Body1 className="font-semibold">Text message campaign</Body1>
                  <Body1 className="text-gray-700">
                    Send date: {dateUsHelper(new Date())} at 11:00 AM
                  </Body1>
                </div>
              </div>
              <div className="mt-8 pb-8 border-t border-slate-200" />
              <div className="flex items-center justify-between">
                <Body1 className="font-semibold  text-xl">Total</Body1>
                <Body1 className="font-semibold text-xl">
                  ${numberFormatter(PRICE_PER_MESSAGE * count, 2)}
                </Body1>
              </div>
            </CardContent>
          </Card>
          <div className="text-center text-blue-600 mt-8">
            You will be taken to your poll momentarily...
          </div>
        </Paper>
      </PollsPageGuard>
    </div>
  )
}
