import { useContext } from 'react'
import { VoterContactsContext } from '@shared/hooks/VoterContactsProvider'

export const useVoterContacts = () => useContext(VoterContactsContext)
