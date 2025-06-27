'use client'

import { useState } from 'react'
import TextField from '@shared/inputs/TextField'
import H2 from '@shared/typography/H2'
import H3 from '@shared/typography/H3'
import Button from '@shared/buttons/Button'
import {
  searchDomains,
  registerDomain,
  completeRegistration,
} from '../../util/domainFetch.util'
import { useSnackbar } from '@shared/utils/Snackbar'
import DomainResult from './DomainResult'
import DomainPurchaseModal from './DomainPurchaseModal'

export default function DomainSearch({ prefillSearch, onRegisterSuccess }) {
  const [searchTerm, setSearchTerm] = useState(prefillSearch || '')
  const [searchResults, setSearchResults] = useState(null)
  const [searchLoading, setSearchLoading] = useState(false)
  const [purchaseLoading, setPurchaseLoading] = useState(null)
  const [purchaseModal, setPurchaseModal] = useState({
    open: false,
    domain: null,
    price: null,
    clientSecret: null,
  })
  const { errorSnackbar } = useSnackbar()

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

  const handlePurchase = async (domainName, price) => {
    setPurchaseLoading(domainName)
    try {
      const response = await registerDomain(domainName)
      if (response.ok) {
        setPurchaseModal({
          open: true,
          domain: domainName,
          price,
          clientSecret: response.data.paymentSecret,
        })
      } else {
        console.error('Payment initialization error:', response)
        errorSnackbar('Failed to initialize payment: ' + response.data?.error)
      }
    } catch (error) {
      console.error('Payment initialization error:', error)
      errorSnackbar('Failed to initialize payment: ' + error.message)
    } finally {
      setPurchaseLoading(null)
    }
  }

  const handleClosePurchaseModal = () => {
    setPurchaseModal({
      open: false,
      domain: null,
      price: null,
      clientSecret: null,
    })
  }

  const handlePurchaseSuccess = async () => {
    const resp = await completeRegistration()
    console.log('completeRegistration resp', resp)
    if (resp.ok) {
      setSearchResults(null)
      onRegisterSuccess()
    } else {
      console.error('Complete registration failed', resp)
      errorSnackbar('Failed to complete registration: ' + resp.data?.error)
    }
    handleClosePurchaseModal()
  }

  return (
    <>
      <div className="space-y-4">
        <H2>Domain Search</H2>
        <div className="flex gap-2">
          <TextField
            label="Search Domain"
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
        <div className="space-y-4">
          <H3>Search Results</H3>

          <DomainResult
            domain={searchResults.domainName}
            price={searchResults.prices.registration}
            available={searchResults.availability === 'AVAILABLE'}
            loading={purchaseLoading === searchResults.domainName}
            onClick={() => {
              if (searchResults.availability === 'AVAILABLE') {
                handlePurchase(
                  searchResults.domainName,
                  searchResults.prices.registration,
                )
              }
            }}
          />

          {searchResults.suggestions?.length > 0 && (
            <div className="space-y-3">
              <H3>Suggestions</H3>
              {searchResults.suggestions.map((suggestion, index) => (
                <DomainResult
                  key={index}
                  domain={suggestion.DomainName}
                  price={suggestion.prices.registration}
                  loading={purchaseLoading === suggestion.DomainName}
                  onClick={() =>
                    handlePurchase(
                      suggestion.DomainName,
                      suggestion.prices.registration,
                    )
                  }
                />
              ))}
            </div>
          )}
        </div>
      )}

      <DomainPurchaseModal
        open={purchaseModal.open}
        onClose={handleClosePurchaseModal}
        onSuccess={handlePurchaseSuccess}
        domainName={purchaseModal.domain}
        price={purchaseModal.price}
        clientSecret={purchaseModal.clientSecret}
      />
    </>
  )
}
