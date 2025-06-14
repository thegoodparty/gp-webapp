import { useMemo } from 'react'
import Button from '@shared/buttons/Button'
import IconButton from '@shared/buttons/IconButton'
import Modal from '@shared/utils/Modal'
import CustomVoterAudienceFilters from './CustomVoterAudienceFilters'
import H2 from '@shared/typography/H2'
import Body1 from '@shared/typography/Body1'
import { InfoRounded } from '@mui/icons-material'

export default function ViewAudienceFiltersModal({
  open,
  onOpen,
  onClose,
  file,
  buttonType = 'icon', // 'icon' or 'button'
  size = 'small',
  className = '',
}) {
  const audienceFilters = useMemo(
    () =>
      file == null || file.filters == null
        ? null
        : file.filters.reduce((acc, filterKey) => {
            acc[filterKey] = true
            return acc
          }, {}),
    [file],
  )

  return (
    <>
      {buttonType === 'icon' ? (
        <IconButton
          size={size}
          color="info"
          title="View Audience Filters"
          className={`flex items-center ${className}`}
          onClick={onOpen}
        >
          <InfoRounded />
        </IconButton>
      ) : (
        <Button
          size={size}
          color="neutral"
          title="View Audience Filters"
          className={`flex gap-2 items-center ${className}`}
          onClick={onOpen}
        >
          <InfoRounded /> View Audience Filters
        </Button>
      )}
      {/*TODO: Refactor to use compositional design patterns and put _just_ a*/}
      {/* modal into a components called `[Something]Modal` so that it can be*/}
      {/* used in other places*/}
      <ActualViewAudienceFiltersModal
        {...{
          open,
          onClose,
          audienceFilters,
          fileName: file ? file.name : 'No file selected',
        }}
      />
    </>
  )
}

export const ActualViewAudienceFiltersModal = ({
  open = false,
  onClose = () => {},
  audienceFilters = {},
  fileName = '',
}) => (
  <Modal open={open} closeCallback={onClose}>
    <div className="w-[80vw] max-w-4xl p-2 md:p-8">
      <H2 className="text-center">
        Custom Voter File Filter: <br />
        {fileName}
      </H2>
      <Body1 className="text-center mb-4 mt-2">
        Viewing your custom audience filters
      </Body1>
      <CustomVoterAudienceFilters audience={audienceFilters} readOnly />
    </div>
  </Modal>
)
