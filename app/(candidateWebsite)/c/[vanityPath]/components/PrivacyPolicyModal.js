'use client'

import ResponsiveModal from '@shared/utils/ResponsiveModal'

export default function PrivacyPolicyModal({ open, onClose, content }) {
  const campaignName = content.campaignName
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
  return (
    <ResponsiveModal
      open={open}
      onClose={onClose}
      title={`SMS Privacy Policy for ${content.main?.title || ''}`}
    >
      <div className="text-sm text-gray-500 mb-4">
        Last Updated: {currentDate}
      </div>
      <div className="space-y-4 text-sm">
        <div>
          <h3 className="font-medium">SMS Communications & Data Collection</h3>
          <p>
            By providing your mobile phone number to the {campaignName}{' '}
            campaign, you consent to receive recurring SMS messages from us.
            Message frequency may vary. We collect your mobile number, opt-in
            information, and messaging interactions to provide you with campaign
            updates, volunteer opportunities, event notifications, and other
            campaign-related communications.
          </p>
        </div>
        <div>
          <h3 className="font-medium">Data Protection Commitment</h3>
          <p>
            We will not share mobile contact information with third parties or
            affiliates for marketing/promotional purposes. All SMS opt-in data
            and consent information will not be shared with any third parties.
            We take your privacy seriously and implement reasonable security
            measures to protect your information.
          </p>
        </div>
        <div>
          <h3 className="font-medium">Your Rights</h3>
          <p>
            You have the right to access, correct, and delete your personal
            information. You can exercise these rights by contacting us at{' '}
            {content.contact?.email || ''}.
          </p>
        </div>
        <div>
          <h3 className="font-medium">Opt-Out Instructions</h3>
          <p>
            You can opt out of receiving text messages at any time by replying
            STOP to any message. After you send the message STOP to us, we will
            send you a reply message to confirm that you have been unsubscribed.
            After this, you will no longer receive SMS messages from us.
          </p>
          <p>
            If you need assistance with text messaging, reply with HELP or
            contact us at {content.contact?.phone || ''} or{' '}
            {content.contact?.email || ''}.
          </p>
        </div>
        <div>
          <h3 className="font-medium">Policy Updates</h3>
          <p>
            We may update this privacy policy from time to time. We will notify
            you of any changes by posting the new policy on this page and, where
            appropriate, via SMS message.
          </p>
        </div>
        <div>
          <h3 className="font-medium">Contact Information</h3>
          <p>
            If you have any questions about our privacy practices or this
            policy, please contact us at:
          </p>
          <p className="mt-2">Email: {content.contact?.email || ''}</p>
          <p>Phone: {content.contact?.phone || ''}</p>
          <p>Address: {content.contact?.address || ''}</p>
        </div>
      </div>
    </ResponsiveModal>
  )
}
