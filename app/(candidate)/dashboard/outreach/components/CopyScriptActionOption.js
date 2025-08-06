'use client'
import { useCampaign } from '@shared/hooks/useCampaign'
import CopyToClipboard from '@shared/utils/CopyToClipboard'
import { OutreachActionWrapper } from 'app/(candidate)/dashboard/outreach/components/OutreachActionWrapper'
import { MdContentCopy } from 'react-icons/md'
import { stripHtml } from 'string-strip-html'

export const CopyScriptActionOption = ({
  outreach = {},
  onCopy = () => {},
}) => {
  const [campaign] = useCampaign()

  const text =
    campaign?.aiContent && outreach && campaign?.aiContent[outreach?.script]
      ? stripHtml(campaign?.aiContent[outreach?.script].content).result
      : outreach?.script || ''

  return (
    <CopyToClipboard
      {...{
        text,
        onCopy,
      }}
    >
      <OutreachActionWrapper>
        <MdContentCopy className="mr-2 inline-block" />
        Copy Script
      </OutreachActionWrapper>
    </CopyToClipboard>
  )
}
