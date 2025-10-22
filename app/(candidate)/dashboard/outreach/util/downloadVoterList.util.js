import { voterFileDownload } from 'helpers/voterFileDownload'

export const downloadVoterList = async (
  { voterFileFilter = {}, outreachType = '' } = {},
  setLoading = () => {},
  errorSnackbar = () => {},
) => {
  setLoading(true)
  
  // Filter for keys that have true values
  // voterFileFilter already has the correct underscore-based keys
  // (e.g., audience_superVoters, party_independent)
  const selectedAudience = Object.keys(voterFileFilter).filter(
    (key) => voterFileFilter[key] === true,
  )

  try {
    await voterFileDownload(outreachType, { filters: selectedAudience })
  } catch (error) {
    errorSnackbar('Error downloading voter file')
  }

  setLoading(false)
}
