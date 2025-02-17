import { OLD_API_ROOT } from 'appEnv';

// Just want to point to old api base for old endpoints we want to keep
let base = `${OLD_API_ROOT}/api/v1/`;

const gpApi = {
  campaign: {
    deleteDemoCampaign: {
      url: `${base}campaign/demo`,
      method: 'DELETE',
      withAuth: true,
    },

    einCheck: {
      url: `${base}campaign/ein-check`,
      method: 'GET',
      withAuth: true,
      returnFullResponse: true,
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

  race: {
    byState: {
      url: `${base}race/by-state`,
      method: 'GET',
    },
    allStates: {
      // for sitemaps
      url: `${base}race/all-state`,
      method: 'GET',
    },
    byCounty: {
      url: `${base}race/by-county`,
      method: 'GET',
    },
    byCity: {
      url: `${base}race/by-city`,
      method: 'GET',
    },
    byRace: {
      url: `${base}race`,
      method: 'GET',
    },
    proximity: {
      url: `${base}race/proximity-cities`,
      method: 'GET',
    },
  },

  candidate: {
    find: {
      url: `${base}candidate`,
      method: 'GET',
    },
    list: {
      url: `${base}candidates`,
      method: 'GET',
    },
    delete: {
      url: `${base}candidate`,
      method: 'DELETE',
      withAuth: true, //admin
    },
  },
};

export default gpApi;
