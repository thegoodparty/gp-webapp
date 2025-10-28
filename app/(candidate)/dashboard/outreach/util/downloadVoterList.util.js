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

  try {
    await voterFileDownload(outreachType, { filters: selectedAudience })
  } catch (error) {
    errorSnackbar('Error downloading voter file')
  }

  setLoading(false)
}
