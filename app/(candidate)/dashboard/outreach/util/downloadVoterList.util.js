import { voterFileDownload } from 'helpers/voterFileDownload'

export const downloadVoterList = async (
  { voterFileFilter = {}, outreachType = '' } = {},
  setLoading = () => {},
  errorSnackbar = () => {},
) => {
  setLoading(true)
  // The voterFileFilter is already in the new format, so we can use it directly
  const audience = voterFileFilter
  const selectedAudience = Object.keys(audience).filter(
    (key) => audience[key] === true,
  )

  // Debug logging
  console.log('🔍 DEBUG - voterFileFilter input:', voterFileFilter)
  console.log('🔍 DEBUG - audience object:', audience)
  console.log('🔍 DEBUG - selectedAudience:', selectedAudience)
  console.log('🔍 DEBUG - outreachType:', outreachType)

  try {
    await voterFileDownload(outreachType, { filters: selectedAudience })
  } catch (error) {
    errorSnackbar('Error downloading voter file')
  }

  setLoading(false)
}
