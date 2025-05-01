import Modal from '@shared/utils/Modal'
import H1 from '@shared/typography/H1'
import Body1 from '@shared/typography/Body1'
import Button from '@shared/buttons/Button'
import Link from 'next/link'

const ComplianceHelpModal = ({ open, onClose }) => (
  <Modal open={open} closeCallback={onClose}>
    <div className="p-4 md:p-6 lg:p-8 min-w-[600px]">
      <H1 className="mb-8 text-center">How this works</H1>
      <Body1>
        We will walk you through the required steps, what&apos;s involved and why.
        <br />
        You will need the following information:
        <ul className="list-disc pl-4 mt-8">
          <li>EIN Number</li>
          <li>Compliant campaign website URL</li>
          <li>Campaign email address</li>
          <li>
            Our team will reach out with next steps after you submit your information
          </li>
        </ul>
        <div className="mt-8 flex justify-between">
          <Button color="neutral" onClick={onClose}>
            Close
          </Button>
          <Link href="/dashboard/text-messaging/p2p-setup/ein">
            <Button color="secondary">Start</Button>
          </Link>
        </div>
      </Body1>
    </div>
  </Modal>
)

export default ComplianceHelpModal 