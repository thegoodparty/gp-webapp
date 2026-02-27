'use client'
import { useCampaign } from '@shared/hooks/useCampaign'
import CopyToClipboard from '@shared/utils/CopyToClipboard'
import { OutreachActionWrapper } from 'app/(candidate)/dashboard/outreach/components/OutreachActionWrapper'
import { MdContentCopy } from 'react-icons/md'
import { stripHtml } from 'string-strip-html'
import { Outreach } from 'app/(candidate)/dashboard/outreach/hooks/OutreachContext'

interface CopyScriptActionOptionProps {
  outreach?: Partial<Outreach>
  onCopy?: () => void
}

export const CopyScriptActionOption = ({
  outreach = {},
  onCopy = () => {},
}: CopyScriptActionOptionProps) => {
  const [campaign] = useCampaign()

  const scriptKey = outreach?.script
  const aiContentEntry =
    scriptKey && campaign?.aiContent ? campaign.aiContent[scriptKey] : null

  let text = outreach?.script || ''
  if (
    aiContentEntry &&
    typeof aiContentEntry === 'object' &&
    'content' in aiContentEntry
  ) {
    const content = aiContentEntry.content
    if (typeof content === 'string') {
      text = stripHtml(content).result
    }
  }

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
