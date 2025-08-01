'use client'
import { useCampaign } from '@shared/hooks/useCampaign'
import CopyToClipboard from '@shared/utils/CopyToClipboard'
import { OutreachActionWrapper } from 'app/(candidate)/dashboard/outreach/components/OutreachActionWrapper'
import { htmlToPlainText } from 'helpers/stringHelper'
import { MdContentCopy } from 'react-icons/md'

export const CopyScriptActionOption = ({
  outreach = {},
  onCopy = () => {},
}) => {
  const [campaign] = useCampaign()

  const text =
    campaign?.aiContent && outreach && campaign?.aiContent[outreach?.script]
      ? htmlToPlainText(campaign?.aiContent[outreach?.script].content)
      : outreach?.script

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
