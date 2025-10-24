import { voterFileDownload } from 'helpers/voterFileDownload'

export const downloadVoterList = async (
  { voterFileFilter = {}, outreachType = '' } = {},
  setLoading = () => {},
  errorSnackbar = () => {},
) => {
  setLoading(true)
  
  // Filter for keys that have true values
  // Only include valid filter keys (audience_, party_, age_, gender_)
  const selectedAudience = Object.keys(voterFileFilter).filter(
    (key) => 
      voterFileFilter[key] === true && 
      (key.startsWith('audience_') || 
       key.startsWith('party_') || 
       key.startsWith('age_') || 
       key.startsWith('gender_'))
  )

  try {
    await voterFileDownload(outreachType, { filters: selectedAudience })
  } catch (error) {
    errorSnackbar('Error downloading voter file')
  }

  setLoading(false)
}
