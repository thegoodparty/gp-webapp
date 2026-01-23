'use client'

import { useState, KeyboardEvent, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import TextField from '@shared/inputs/TextField'
import H2 from '@shared/typography/H2'
import H3 from '@shared/typography/H3'
import Button from '@shared/buttons/Button'
import { searchDomains, DomainSearchResults } from '../../util/domainFetch.util'
import { useSnackbar } from '@shared/utils/Snackbar'
import DomainResult from './DomainResult'
import { useWebsite } from '../../components/WebsiteProvider'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import { isValidUrl } from 'helpers/linkhelper'
import Body2 from '@shared/typography/Body2'
import { sendToPurchaseDomainFlow } from 'app/(candidate)/dashboard/website/util/domain.util'

interface DomainSearchProps {
  prefillSearch?: string
}

export default function DomainSearch({ prefillSearch }: DomainSearchProps): React.JSX.Element {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState(prefillSearch || '')
  const [searchResults, setSearchResults] = useState<DomainSearchResults | null>(null)
  const [searchLoading, setSearchLoading] = useState(false)
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const { errorSnackbar } = useSnackbar()
  const { website } = useWebsite()
  const websiteId = website?.id

  const handleEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSearch()
    }
  }

  const handleSearch = async () => {
    const trimmedSearchTerm = searchTerm.trim()
    if (!trimmedSearchTerm) {
      errorSnackbar('Please enter a domain name to search')
      return
    }

    setSearchLoading(true)
    try {
      const response = await searchDomains(trimmedSearchTerm)
      if (response.ok) {
        setSearchResults(response.data)
      } else {
        console.error('Domain search error:', response)
        errorSnackbar('Failed to search domains')
      }
    } catch (error) {
      console.error('Domain search error:', error)
      errorSnackbar('Failed to search domains')
    } finally {
      setSearchLoading(false)
    }
  }

  const handleToggleDomain = (domainName: string) => {
    if (selectedDomain === domainName) {
      setSelectedDomain(null)
    } else {
      setSelectedDomain(domainName)

      const domainData =
        searchResults?.domainName === domainName
          ? searchResults
          : searchResults?.suggestions?.find((s) => s.DomainName === domainName)

      const price =
        domainData?.price ||
        (domainData && typeof domainData.price !== 'undefined'
          ? domainData.price
          : null)

      trackEvent(EVENTS.CandidateWebsite.SelectedDomain, {
        domainSearchedFor: searchTerm.trim(),
        domainSelected: domainName,
        priceOfSelectedDomain: price,
      })
    }
  }

  const handlePurchase = () => {
    setCheckoutLoading(true)
    if (!websiteId) {
      errorSnackbar('Website ID is required')
      setCheckoutLoading(false)
      return
    }
    if (!selectedDomain) {
      errorSnackbar('Please select a domain')
      setCheckoutLoading(false)
      return
    }

    sendToPurchaseDomainFlow({
      websiteId,
      domainName: selectedDomain.toLowerCase(),
      router,
    })
    setCheckoutLoading(false)
  }

  const isValidDomain = isValidUrl(`https://${searchTerm}`)

  return (
    <>
      <div className="space-y-4">
        <H2>Choose your domain name</H2>
        <div className="flex gap-2">
          <TextField
            label="Search for a domain"
            placeholder="yourdomain.com"
            fullWidth
            value={searchTerm}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            onKeyPress={handleEnter}
            InputLabelProps={{ shrink: true }}
            error={!isValidDomain}
          />
          <Button
            onClick={handleSearch}
            loading={searchLoading}
            disabled={!isValidDomain || searchLoading}
            className="whitespace-nowrap"
          >
            Search
          </Button>
        </div>
        {!isValidDomain && (
          <Body2 className="text-red-500">
            Please enter a valid domain (example.com)
          </Body2>
        )}
      </div>

      {searchResults && (
        <div className="mt-8 ">
          <H3 className="mb-4">Search Results</H3>

          <DomainResult
            domain={searchResults.domainName}
            price={searchResults.price}
            available={searchResults.availability === 'AVAILABLE'}
            loading={false}
            onClick={() => {
              if (searchResults.availability === 'AVAILABLE') {
                handleToggleDomain(searchResults.domainName)
              }
            }}
            selected={selectedDomain === searchResults.domainName}
          />

          {searchResults.suggestions && searchResults.suggestions.length > 0 && (
            <div className="mt-8 space-y-3">
              <H3>Suggestions</H3>
              {searchResults.suggestions.map((suggestion, index) => (
                <DomainResult
                  key={index}
                  domain={suggestion.DomainName}
                  price={suggestion.price}
                  loading={false}
                  onClick={() => handleToggleDomain(suggestion.DomainName)}
                  selected={selectedDomain === suggestion.DomainName}
                />
              ))}
            </div>
          )}
        </div>
      )}
      <div className="h-24"></div>
      <div className="fixed bottom-0 left-0 right-0 w-full bg-white p-4">
        <div className="flex justify-end items-center">
          <Button
            onClick={handlePurchase}
            disabled={!selectedDomain}
            loading={checkoutLoading}
          >
            Checkout
          </Button>
        </div>
      </div>
    </>
  )
}
