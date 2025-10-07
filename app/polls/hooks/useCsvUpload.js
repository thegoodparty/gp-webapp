'use client'
import { useState, useEffect } from 'react'
import { uploadSampleCsv } from '../utils/uploadSampleCsv'

export const useCsvUpload = (contactsSample, campaign, csvUrl, setCsvUrl) => {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    const uploadCsv = async () => {
      // Early returns for conditions that don't require upload
      if (!contactsSample || !Array.isArray(contactsSample) || contactsSample.length === 0) return
      if (!campaign?.id || !campaign?.slug) return
      if (csvUrl) return // already uploaded

      try {
        setIsUploading(true)
        setError(null)

        const publicUrl = await uploadSampleCsv(contactsSample, campaign)
        if (publicUrl && isMounted) {
          setCsvUrl(publicUrl)
        }
      } catch (error) {
        console.error(error)
        if (isMounted) {
          setError('Failed to upload sample CSV')
        }
      } finally {
        if (isMounted) {
          setIsUploading(false)
        }
      }
    }

    uploadCsv()
    
    return () => {
      isMounted = false
    }
  }, [contactsSample, campaign, csvUrl, setCsvUrl])

  return {
    isUploadingCsvSample: isUploading,
    csvSampleError: error
  }
}
