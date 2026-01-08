'use client'

import DashboardLayout from '../../shared/DashboardLayout'
import Paper from '@shared/utils/Paper'
import { Fragment, useEffect, useState } from 'react'
import H2 from '@shared/typography/H2'
import Body2 from '@shared/typography/Body2'
import Overline from '@shared/typography/Overline'
import CustomVoterFile from './CustomVoterFile'
import { getCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions'
import CantDownload from './CantDownload'
import Link from 'next/link'
import { slugify } from 'helpers/articleHelper'
import voterFileTypes from './VoterFileTypes'
import NeedHelp from './NeedHelp'
import ViewAudienceFiltersModal from './ViewAudienceFiltersModal'
import { apiRoutes } from 'gpApi/routes'
import { clientFetch } from 'gpApi/clientFetch'
import { trackEvent, EVENTS } from 'helpers/analyticsHelper'
import PaginationButtons from './PaginationButtons'
import { Campaign, User } from 'helpers/types'

interface VoterFile {
  key: string | number
  name: string
  fields: string[]
  isCustom?: boolean
  filters?: string[]
}

interface VoterRecordsPageProps {
  pathname: string
  user?: User | null
  campaign: Campaign | null
  canDownload: boolean
}

const tableHeaders = ['NAME', 'CHANNEL', 'PURPOSE', 'AUDIENCE']
const ITEMS_PER_PAGE = 50

export interface VoterFileResponse {
  ok?: boolean
  blob?: () => Promise<Blob>
}

interface DownloadFilters {
  filters?: string[]
}

export async function fetchVoterFile(type: string, customFilters?: DownloadFilters): Promise<VoterFileResponse | false> {
  try {
    const payload: { type: string; customFilters?: string } = {
      type,
    }

    if (customFilters) {
      payload.customFilters = JSON.stringify(customFilters)
    }

    return await clientFetch(apiRoutes.voters.voterFile.get, payload, {
      returnFullResponse: true,
    })
  } catch (e) {
    console.error('error', e)
    return false
  }
}

async function wakeUp() {
  try {
    return await clientFetch(apiRoutes.voters.voterFile.wakeUp)
  } catch (e) {
    console.error('error', e)
    return false
  }
}

export default function VoterRecordsPage(props: VoterRecordsPageProps): React.JSX.Element {
  const [campaign, setCampaign] = useState<Campaign | null>(props.campaign)
  const [modalFileKey, setModalFileKey] = useState<string | number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')

  const addCustomVoterFiles = (): VoterFile[] => {
    if (
      campaign &&
      campaign.data?.customVoterFiles &&
      campaign.data?.customVoterFiles.length > 0
    ) {
      const updatedFiles: VoterFile[] = [...voterFileTypes]

      campaign.data.customVoterFiles.forEach((file, i) => {
        updatedFiles.push({
          key: `custom-${i}`,
          isCustom: true,
          name: file.name || '',
          fields: [
            file.name || '',
            file.channel || '',
            file.purpose || '',
            'Custom Voter File',
          ],
          filters: file.filters,
        })
      })
      return updatedFiles
    }
    return voterFileTypes
  }
  const withCustom = addCustomVoterFiles()
  const [voterFiles, setVoterFiles] = useState<VoterFile[]>(withCustom)

  // Search filtering
  const filteredVoterFiles = voterFiles.filter((file) => {
    const matchesSearch = file.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())

    return matchesSearch
  })

  // Pagination logic
  const totalItems = filteredVoterFiles.length
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentPageItems = filteredVoterFiles.slice(startIndex, endIndex)

  const goToPage = (page: number): void => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  useEffect(() => {
    wakeUp()
  }, [])

  useEffect(() => {
    const updatedFiles = addCustomVoterFiles()
    setVoterFiles(updatedFiles)
  }, [campaign])

  const reloadCampaign = async () => {
    const loadedCampaign = await getCampaign()
    if (loadedCampaign !== false) {
      setCampaign(loadedCampaign)
    }
  }

  return (
    <DashboardLayout {...props}>
      <Paper className="md:p-6">
        {props.canDownload ? (
          <>
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-6">
                <H2 className="mb-2">Voter File</H2>
                <Body2 className="text-gray-600">
                  A collection of voter data spreadsheets, tailored to your
                  needs.
                </Body2>
              </div>
              <div className="col-span-12 md:col-span-6 md:flex md:justify-end md:items-center">
                <NeedHelp />
                {campaign && (
                  <CustomVoterFile
                    {...props}
                    reloadCampaignCallback={reloadCampaign}
                    campaign={campaign}
                    buttonPosition="top"
                  />
                )}
              </div>
            </div>
            <div className="mt-6 flex gap-2 justify-between items-center">
              <div className="flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search voter files..."
                  className="p-2 w-full border border-gray-300 rounded text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {totalPages > 1 && (
                <PaginationButtons
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={goToPage}
                />
              )}
            </div>
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 border-x border-x-gray-200 ">
              {tableHeaders.map((header, index) => (
                <div
                  className={` bg-primary text-white p-4 ${
                    index === 0 ? 'rounded-tl-lg' : ''
                  } ${
                    index === tableHeaders.length - 1 ? 'rounded-tr-lg ' : ''
                  } ${index === 2 ? 'rounded-tr-lg lg:rounded-tr-none' : ''} ${
                    index === 1 ? 'rounded-tr-lg md:rounded-tr-none' : ''
                  } ${index === 0 ? 'rounded-tr-lg sm:rounded-tr-none' : ''} ${
                    index === 2 ? 'col-span-1' : 'col-span-2'
                  } ${header === 'AUDIENCE' ? 'hidden lg:block' : ''}
              
              ${header === 'PURPOSE' ? 'hidden md:block' : ''} ${
                    header === 'CHANNEL' ? 'hidden sm:block' : ''
                  }`}
                  key={index}
                >
                  <Overline>{header}</Overline>
                </div>
              ))}
              {currentPageItems.map((file, index) => (
                <Fragment key={file.key}>
                  {file.fields.map((field, index2) => (
                    <div
                      key={`${file.key}-${index2}`}
                      className={`p-4 border-b border-b-gray-200 flex items-center ${
                        index % 2 !== 0 ? ' bg-indigo-50' : ''
                      } ${index2 === 2 ? 'col-span-1' : 'col-span-2'}
                  
                  ${index2 === 3 ? 'hidden lg:flex ' : ''} ${
                        index2 === 2 ? 'hidden md:flex ' : ''
                      }${index2 === 1 ? 'hidden sm:flex' : ''}`}
                    >
                      {index2 === 0 ? (
                        <Link
                          href={
                            file.isCustom
                              ? `/dashboard/voter-records/custom-${slugify(
                                  file.name,
                                  true,
                                )}`
                              : `/dashboard/voter-records/${String(file.key).toLowerCase()}`
                          }
                          onClick={() => {
                            trackEvent(EVENTS.VoterData.ClickDetail, {
                              type: file.key,
                              file: file.name,
                              isCustom: file.isCustom,
                            })
                          }}
                          className="text-info underline hover:text-info-dark"
                        >
                          {field}
                        </Link>
                      ) : (
                        <>
                          {field}
                          {file.isCustom && index2 === 3 && (
                            <ViewAudienceFiltersModal
                              open={modalFileKey === file.key}
                              file={file}
                              onOpen={() => {
                                trackEvent(
                                  EVENTS.VoterData.FileDetail.ClickInfoIcon,
                                )
                                setModalFileKey(file.key)
                              }}
                              onClose={() => setModalFileKey(null)}
                              className="ml-1 self-center"
                            />
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </Fragment>
              ))}
            </div>
            <div className="mt-8 flex justify-center">
              {campaign && (
                <CustomVoterFile
                  {...props}
                  reloadCampaignCallback={reloadCampaign}
                  campaign={campaign}
                  buttonPosition="bottom"
                />
              )}
            </div>
          </>
        ) : (
          <CantDownload campaign={campaign} />
        )}
      </Paper>
    </DashboardLayout>
  )
}
