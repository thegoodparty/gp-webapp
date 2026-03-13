import { useMemo } from 'react'
import Button from '@shared/buttons/Button'
import IconButton from '@shared/buttons/IconButton'
import Modal from '@shared/utils/Modal'
import CustomVoterAudienceFilters, {
  AudienceFiltersState,
  AudienceFilterKey,
} from './CustomVoterAudienceFilters'

const VALID_AUDIENCE_FILTER_KEYS: Set<string> = new Set([
  'audience_superVoters',
  'audience_likelyVoters',
  'audience_unreliableVoters',
  'audience_unlikelyVoters',
  'audience_firstTimeVoters',
  'party_independent',
  'party_democrat',
  'party_republican',
  'age_18_25',
  'age_25_35',
  'age_35_50',
  'age_50_plus',
  'gender_male',
  'gender_female',
  'gender_unknown',
  'audience_request',
])

const isAudienceFilterKey = (key: string): key is AudienceFilterKey => {
  return VALID_AUDIENCE_FILTER_KEYS.has(key)
}
import H2 from '@shared/typography/H2'
import Body1 from '@shared/typography/Body1'
import { InfoRounded } from '@mui/icons-material'
import { CustomVoterFile } from 'helpers/types'

interface ViewAudienceFiltersModalProps {
  open: boolean
  onOpen: () => void
  onClose: () => void
  file: CustomVoterFile | null
  buttonType?: 'icon' | 'button'
  size?: 'small' | 'medium' | 'large'
  className?: string
}

const ViewAudienceFiltersModal = ({
  open,
  onOpen,
  onClose,
  file,
  buttonType = 'icon',
  size = 'small',
  className = '',
}: ViewAudienceFiltersModalProps): React.JSX.Element => {
  const audienceFilters = useMemo<AudienceFiltersState | undefined>(
    () =>
      file == null || file.filters == null
        ? undefined
        : file.filters.reduce<AudienceFiltersState>((acc, filterKey) => {
            if (isAudienceFilterKey(filterKey)) {
              acc[filterKey] = true
            }
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
      <ActualViewAudienceFiltersModal
        open={open}
        onClose={onClose}
        audienceFilters={audienceFilters}
        fileName={file ? file.name : 'No file selected'}
      />
    </>
  )
}

interface ActualViewAudienceFiltersModalProps {
  open?: boolean
  onClose?: () => void
  audienceFilters?: AudienceFiltersState
  fileName?: string
}

export const ActualViewAudienceFiltersModal = ({
  open = false,
  onClose = () => {},
  audienceFilters,
  fileName = '',
}: ActualViewAudienceFiltersModalProps): React.JSX.Element => (
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

export default ViewAudienceFiltersModal
