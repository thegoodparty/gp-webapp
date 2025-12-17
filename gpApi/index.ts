import { OLD_API_ROOT } from 'appEnv'

interface GpApiEndpoint {
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  withAuth?: boolean
}

interface GpApiRoutes {
  campaign: {
    deleteDemoCampaign: GpApiEndpoint
  }
  admin: {
    deactivateCandidate: GpApiEndpoint
    candidates: GpApiEndpoint
    deleteCandidate: GpApiEndpoint
    reactivateCandidate: GpApiEndpoint
  }
}

const base = `${OLD_API_ROOT}/api/v1/`

const gpApi: GpApiRoutes = {
  campaign: {
    deleteDemoCampaign: {
      url: `${base}campaign/demo`,
      method: 'DELETE',
      withAuth: true,
    },
  },

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
