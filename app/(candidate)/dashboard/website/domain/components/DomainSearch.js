'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import TextField from '@shared/inputs/TextField'
import H2 from '@shared/typography/H2'
import H3 from '@shared/typography/H3'
import Button from '@shared/buttons/Button'
import { searchDomains } from '../../util/domainFetch.util'
import { useSnackbar } from '@shared/utils/Snackbar'
import DomainResult from './DomainResult'
import { PURCHASE_TYPES } from '/helpers/purchaseTypes'
import { useWebsite } from '../../components/WebsiteProvider'

export default function DomainSearch({ prefillSearch, onRegisterSuccess }) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState(prefillSearch || '')
  const [searchResults, setSearchResults] = useState(null)
  const [searchLoading, setSearchLoading] = useState(false)
  const { errorSnackbar } = useSnackbar()
  const { website } = useWebsite()
  const { id: websiteId } = website

  const handleEnter = (e) => {
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

  const handlePurchase = (domainName) => {
    if (!websiteId) {
      errorSnackbar('Website ID is required')
      return
    }

    const purchaseUrl = `/dashboard/purchase?type=${
      PURCHASE_TYPES.DOMAIN_REGISTRATION
    }&domain=${encodeURIComponent(
      domainName,
    )}&websiteId=${websiteId}&returnUrl=${encodeURIComponent(
      '/dashboard/website/domain?success=true',
    )}`
    router.push(purchaseUrl)
  }

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
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleEnter}
            InputLabelProps={{ shrink: true }}
          />
          <Button
            onClick={handleSearch}
            loading={searchLoading}
            disabled={!searchTerm.trim() || searchLoading}
            className="whitespace-nowrap"
          >
            Search
          </Button>
        </div>
      </div>

      {searchResults && (
        <div className="mt-8 ">
          <H3 className="mb-4">Search Results</H3>

          <DomainResult
            domain={searchResults.domainName}
            price={searchResults.prices.registration}
            available={searchResults.availability === 'AVAILABLE'}
            loading={false}
            onClick={() => {
              if (searchResults.availability === 'AVAILABLE') {
                handlePurchase(searchResults.domainName)
              }
            }}
          />

          {searchResults.suggestions?.length > 0 && (
            <div className="mt-8 space-y-3">
              <H3>Suggestions</H3>
              {searchResults.suggestions.map((suggestion, index) => (
                <DomainResult
                  key={index}
                  domain={suggestion.DomainName}
                  price={suggestion.prices.registration}
                  loading={false}
                  onClick={() => handlePurchase(suggestion.DomainName)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}
