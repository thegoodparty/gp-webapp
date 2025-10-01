'use client'
import { useContactsStats as useContactsStatsContext } from '../contexts/ContactsStatsContext'

/**
 * Custom hook to access contacts stats data within the polls layout
 * 
 * @returns {Object} Object containing:
 *   - contactsStats: The contacts statistics data
 *   - isLoading: Boolean indicating if data is being fetched
 *   - error: Error message if fetch failed
 *   - fetchContactsStats: Function to fetch contacts stats
 * 
 */
export const useContactsStats = () => {
  return useContactsStatsContext()
}
