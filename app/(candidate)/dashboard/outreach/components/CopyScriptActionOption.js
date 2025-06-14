import CopyToClipboard from '@shared/utils/CopyToClipboard'
import { OutreachActionWrapper } from 'app/(candidate)/dashboard/outreach/components/OutreachActionWrapper'
import { MdContentCopy } from 'react-icons/md'

export const CopyScriptActionOption = ({
  outreach = {},
  onCopy = () => {},
}) => (
  <CopyToClipboard
    {...{
      text: outreach?.script || '',
      onCopy,
    }}
  >
    <OutreachActionWrapper>
      <MdContentCopy className="mr-2 inline-block" />
      Copy Script
    </OutreachActionWrapper>
  </CopyToClipboard>
)
