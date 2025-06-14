import { useState } from 'react'
import { useSnackbar } from '@shared/utils/Snackbar'
import { downloadVoterList } from 'app/(candidate)/dashboard/outreach/util/downloadVoterList.util'
import { OutreachActionWrapper } from 'app/(candidate)/dashboard/outreach/components/OutreachActionWrapper'
import { MdDownload } from 'react-icons/md'
import ButtonLoading from '@shared/buttons/ButtonLoading'

export const DownloadAudienceActionOption = ({
  outreach = {},
  onClick = () => {},
  disabled = false,
}) => {
  const [loading, setLoading] = useState(false)
  const { errorSnackbar } = useSnackbar()
  const isDisabled = disabled || loading

  const handleClick = async () => {
    await downloadVoterList(outreach, setLoading, errorSnackbar)
    onClick()
  }

  return (
    <OutreachActionWrapper
      {...{
        onClick: !isDisabled ? handleClick : () => {},
        className: `${isDisabled ? 'opacity-70 !cursor-not-allowed' : ''}`,
      }}
    >
      <MdDownload className="mr-2 inline-block" />
      <span>Download list</span>
      {loading && <ButtonLoading className="mr-0 ml-2" />}
    </OutreachActionWrapper>
  )
}
