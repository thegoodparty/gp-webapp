import { OLD_API_ROOT, ELECTION_API_ROOT } from 'appEnv'

// Just want to point to old api base for old endpoints we want to keep
let base = `${OLD_API_ROOT}/api/v1/`
let electionBase = `${ELECTION_API_ROOT}/v1/`

const gpApi = {
  campaign: {
    deleteDemoCampaign: {
      url: `${base}campaign/demo`,
      method: 'DELETE',
      withAuth: true,
    },
  },

  //
  // admin
  //
  admin: {
    deactivateCandidate: {
      url: `${base}admin/deactivate-candidate-by-campaign`,
      method: 'PUT',
      withAuth: true,
    },
    candidates: {
      url: `${base}admin/candidates`,
      method: 'GET',
      withAuth: true,
    },
    deleteCandidate: {
      url: `${base}new-candidate`,
      method: 'DELETE',
      withAuth: true,
    },
    reactivateCandidate: {
      url: `${base}admin/candidate/reactivate`,
      method: 'PUT',
      withAuth: true,
    },
  },
}

export default gpApi
