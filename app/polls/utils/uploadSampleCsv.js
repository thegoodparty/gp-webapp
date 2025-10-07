import { uploadBlobToS3 } from '@shared/utils/s3Upload'
import { FOLDER_NAME, getPollSubFolderName } from './s3utils'

const csvEscape = (value) => {
  if (value === null || value === undefined) return ''
  const str = String(value)
  const mustQuote = /[",\n]/.test(str)
  const escaped = str.replace(/"/g, '""')
  return mustQuote ? `"${escaped}"` : escaped
}

export const buildCsvFromContacts = (contactsArray) => {
  if (!Array.isArray(contactsArray) || contactsArray.length === 0) return ''
  const headers = [
    'id','firstName','lastName','gender','age','politicalParty','registeredVoter','activeVoter','voterStatus','address','cellPhone','landline','maritalStatus','hasChildrenUnder18','veteranStatus','homeowner','businessOwner','levelOfEducation','ethnicityGroup','language','estimatedIncomeRange','lat','lng'
  ]
  const lines = [headers.join(',')]
  for (const person of contactsArray) {
    const row = headers.map((key) => csvEscape(person?.[key] ?? ''))
    lines.push(row.join(','))
  }
  return lines.join('\n')
}

export const uploadSampleCsv = async (contactsSample, campaign) => {
  if (!contactsSample || !Array.isArray(contactsSample) || contactsSample.length === 0) return null
  if (!campaign?.id || !campaign?.slug) return null

  const csvString = buildCsvFromContacts(contactsSample)
  if (!csvString) return null

  const fileName = `sample-contacts-${Date.now()}.csv`
  const fileType = 'text/csv'
  const folder = `${FOLDER_NAME}/${getPollSubFolderName(campaign.id, campaign.slug)}`

  const publicUrl = await uploadBlobToS3({
    blobOrFile: new Blob([csvString], { type: fileType }),
    fileType,
    fileName,
    folder,
  })
  return publicUrl
}


