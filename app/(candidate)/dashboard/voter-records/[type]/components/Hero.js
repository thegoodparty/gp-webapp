'use client'

import { useMemo, useState } from 'react'
import Paper from '@shared/utils/Paper'
import VoterFileTypes from '../../components/VoterFileTypes'
import H2 from '@shared/typography/H2'
import Body2 from '@shared/typography/Body2'
import Overline from '@shared/typography/Overline'
import RecordCount from './RecordCount'
import slugify from 'slugify'
import DownloadFile from './DownloadFile'
import ViewAudienceFiltersModal from '../../components/ViewAudienceFiltersModal'
import { trackEvent, EVENTS } from 'helpers/fullStoryHelper'

export default function Hero(props) {
  const { type, campaign, fileName, customFile } = props
  const [modalOpen, setModalOpen] = useState()
  const voterFileTypes = useMemo(() => {
    const dupedFileTypes = [...VoterFileTypes]

    if (
      campaign.data?.customVoterFiles &&
      campaign.data?.customVoterFiles.length > 0 &&
      dupedFileTypes.length === 6
    ) {
      campaign.data?.customVoterFiles.forEach((file, i) => {
        dupedFileTypes.push({
          key: `custom-${slugify(file.name)}`,
          index: i,
          isCustom: true,
          name: file.name,
          fields: [
            file.channel,
            file.name,
            file.purpose || '',
            'Custom Voter File',
          ],
        })
      })
    }

    return dupedFileTypes
  }, [campaign.data?.customVoterFiles])

  const fileByKey = {}
  voterFileTypes.forEach((file) => {
    fileByKey[file.key.toLowerCase()] = file
  })

  const file = fileByKey[type]
  const { isCustom, index } = file || {}

  return (
    <Paper className="mt-4">
      <div className="md:flex justify-between">
        <div className="grow">
          <H2>{fileName}</H2>
          <Body2 className="mt-2">
            Key data associated with this voter file.
          </Body2>
        </div>
        {isCustom && (
          <div className="mt-3 md:mt-0 mr-2">
            <ViewAudienceFiltersModal
              buttonType="button"
              size="large"
              open={modalOpen}
              file={customFile}
              onOpen={() => {
                trackEvent(EVENTS.VoterData.FileDetail.ClickViewFilters)
                setModalOpen(true)
              }}
              onClose={() => {
                setModalOpen(false)
              }}
            />
          </div>
        )}
        <DownloadFile {...props} isCustom={isCustom} index={index} />
      </div>
      <div className="mt-6 grid grid-cols-12 gap-4">
        <div className=" col-span-12">
          <Paper>
            <Overline className="mb-2"># of Records</Overline>
            <RecordCount {...props} isCustom={isCustom} index={index} />
          </Paper>
        </div>
      </div>
    </Paper>
  )
}
