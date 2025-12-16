'use client'
import { useRef, useState } from 'react'
import TextField from '@shared/inputs/TextField'
import PrimaryButton from '@shared/buttons/PrimaryButton'
import { CircularProgress } from '@mui/material'
import { HiddenFileUploadInput } from '@shared/inputs/HiddenFileUploadInput'
import { useCampaign } from '@shared/hooks/useCampaign'
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions'
import { InputHelpIcon } from 'app/(candidate)/dashboard/shared/InputHelpIcon'
import { apiRoutes } from 'gpApi/routes'
import { clientFetch } from 'gpApi/clientFetch'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'

const FILE_LIMIT_MB = 10

const EIN_SUPPORT_DOCUMENT_FOLDERNAME_POSTFIX = `ein-support-documents`

const HELP_MESSAGE =
  'A campaign filing document is the official document you filed with your election agency (e.g., Secretary of State or Board of Elections) to declare your candidacy. Common names include Statement of Candidacy, Declaration of Candidacy, or Certificate of Nomination.'

const getEinSupportDocumentFolderName = (id: number, slug: string): string =>
  `${id}-${slug}-${EIN_SUPPORT_DOCUMENT_FOLDERNAME_POSTFIX}`

interface SignedUploadUrlResponse {
  signedUploadUrl: string
}

const uploadFileToS3 = async (file: File, bucket: string): Promise<Response> => {
  const { name: fileName, type: fileType } = file

  const resp = await clientFetch<SignedUploadUrlResponse>(apiRoutes.user.files.generateSignedUploadUrl, {
    fileType,
    fileName,
    bucket,
  })

  const { signedUploadUrl } = resp.data
  const formData = new FormData()
  formData.append('document', file, fileName)
  return await fetch(signedUploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': fileType,
    },
    body: formData,
  })
}

interface CampaignData {
  id?: number
  slug?: string
}

interface CommitteeSupportingFilesUploadProps {
  campaign?: CampaignData
  inputValue?: string
  onUploadSuccess?: (filename: string) => void
  onUploadError?: (e: Error) => void
}

export const CommitteeSupportingFilesUpload = ({
  campaign = {},
  inputValue = '',
  onUploadSuccess = () => {},
  onUploadError = () => {},
}: CommitteeSupportingFilesUploadProps): React.JSX.Element => {
  const [authenticatedCampaign] = useCampaign()
  const campaignId = campaign?.id || authenticatedCampaign?.id
  const campaignSlug = campaign?.slug || authenticatedCampaign?.slug
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [fileInfo, setFileInfo] = useState<File | null>(null)
  const [loadingFileUpload, setLoadingFileUpload] = useState(false)
  const [errorMessge, setErrorMessage] = useState('')

  const onFileBrowseClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChoose = async (_fileData: string | ArrayBuffer | null, file: File) => {
    setErrorMessage(``)
    const fileSizeMb = file?.size / 1e6
    if (fileSizeMb > FILE_LIMIT_MB) {
      setErrorMessage(
        `File size of ${fileSizeMb.toFixed(
          2,
        )}MB is larger than ${FILE_LIMIT_MB}MB limit`,
      )
      onUploadError(new Error('File size too large'))
      return
    }
    setLoadingFileUpload(true)
    setFileInfo(file)

    try {
      if (!campaignId || !campaignSlug) {
        throw new Error('Campaign ID or slug not available')
      }
      const bucketFolderName = getEinSupportDocumentFolderName(
        campaignId,
        campaignSlug,
      )
      const bucket = `ein-supporting-documents/${bucketFolderName}`
      const result = await uploadFileToS3(file, bucket)
      if (!result?.ok) {
        throw new Error('Failed to upload file to S3')
      }
      await updateCampaign(
        [
          {
            key: 'details.einSupportingDocument',
            value: `${bucketFolderName}/${file.name}`,
          },
        ],
        campaignSlug,
      )
      onUploadSuccess(file.name)
    } catch (e) {
      onUploadError(e instanceof Error ? e : new Error('Unknown error'))
    } finally {
      setLoadingFileUpload(false)
    }
  }

  return (
    <div className="grid grid-cols-10 gap-6 align-center mt-4">
      <TextField
        error={Boolean(errorMessge)}
        className="cursor-pointer col-span-10 md:col-span-7"
        value={fileInfo?.name || inputValue || ''}
        onClick={() => {
          trackEvent(EVENTS.ProUpgrade.CommitteeCheck.ClickUpload, {
            element: 'field',
          })
          onFileBrowseClick()
        }}
        label="Upload Campaign Filing Document"
        disabled={loadingFileUpload}
        helperText={
          errorMessge || `PDF file with size less than ${FILE_LIMIT_MB}MB`
        }
        InputProps={{
          endAdornment: (
            <InputHelpIcon
              showOnFocus
              message={HELP_MESSAGE}
              onOpen={() => {
                trackEvent(EVENTS.ProUpgrade.CommitteeCheck.HoverUploadHelp)
              }}
            />
          ),
        }}
      />
      <PrimaryButton
        className="flex items-center justify-center h-[56px] col-span-10 md:col-span-3 md:mt-[5px] md:h-[51px]"
        variant="outlined"
        onClick={() => {
          trackEvent(EVENTS.ProUpgrade.CommitteeCheck.ClickUpload, {
            element: 'button',
          })
          onFileBrowseClick()
        }}
        disabled={loadingFileUpload}
        fullWidth
      >
        <span>Upload</span>
        {loadingFileUpload && (
          <CircularProgress className="text-primary-light ml-2" size={16} />
        )}
      </PrimaryButton>
      <HiddenFileUploadInput
        ref={fileInputRef}
        onChange={handleFileChoose}
        accept=".pdf"
      />
    </div>
  )
}
