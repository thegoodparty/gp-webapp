'use client'

import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import {
  PURCHASE_TYPES,
  PURCHASE_TYPE_LABELS,
  PURCHASE_TYPE_DESCRIPTIONS,
} from '/helpers/purchaseTypes'
import H1 from '@shared/typography/H1'
import H2 from '@shared/typography/H2'
import Body1 from '@shared/typography/Body1'
import PurchaseForm from './PurchaseForm'
import Paper from '@shared/utils/Paper'
import DashboardLayout from '../../shared/DashboardLayout'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

export default function PurchasePayment({
  type,
  domain,
  websiteId,
  purchaseIntent,
  onPaymentSuccess,
  onPaymentError,
}) {
  const purchaseDetails = {
    type,
    label: PURCHASE_TYPE_LABELS[type],
    description: PURCHASE_TYPE_DESCRIPTIONS[type],
    amount: purchaseIntent.amount,
    metadata: {
      domainName: domain,
      websiteId: parseInt(websiteId),
    },
  }

  return (
    <DashboardLayout hideMenu showAlert={false}>
      <Paper className="max-w-2xl mx-auto mt-8">
        <H1>Complete Your Purchase</H1>

        <div className="bg-gray-50 p-4 rounded-lg mt-6 mb-8">
          <H2>{purchaseDetails.label}</H2>
          <Body1 className="text-gray-600 mt-2">
            {purchaseDetails.description}
          </Body1>
          {type === PURCHASE_TYPES.DOMAIN_REGISTRATION && (
            <Body1 className="font-semibold mt-2">Domain: {domain}</Body1>
          )}
          <Body1 className="font-semibold mt-2">
            Amount: ${purchaseDetails.amount}
          </Body1>
        </div>

        <Elements
          stripe={stripePromise}
          options={{ clientSecret: purchaseIntent.clientSecret }}
        >
          <PurchaseForm onSuccess={onPaymentSuccess} onError={onPaymentError} />
        </Elements>
      </Paper>
    </DashboardLayout>
  )
}
