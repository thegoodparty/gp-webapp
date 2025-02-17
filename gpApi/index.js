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

    volunteerInvitation: {
      create: {
        url: `${base}campaign/volunteer/invitation`,
        method: 'POST',
        withAuth: true,
      },
      list: {
        url: `${base}campaign/volunteer/invitations`,
        method: 'GET',
        withAuth: true,
      },
      listByUser: {
        url: `${base}campaign/volunteer/invitations-by-user`,
        method: 'GET',
        withAuth: true,
      },
      delete: {
        url: `${base}campaign/volunteer/invitation`,
        method: 'DELETE',
        withAuth: true,
      },
    },

    campaignRequests: {
      create: {
        url: `${base}campaign/volunteer/request`,
        method: 'POST',
        withAuth: true,
      },
      list: {
        url: `${base}campaign/volunteer/requests`,
        method: 'GET',
        withAuth: true,
      },
      get: {
        url: `${base}campaign/volunteer/request`,
        method: 'GET',
        withAuth: true,
      },
      grant: {
        url: `${base}campaign/volunteer/request/grant`,
        method: 'GET',
        withAuth: true,
      },
      delete: {
        url: `${base}campaign/volunteer/request`,
        method: 'DELETE',
        withAuth: true,
      },
    },

    campaignVolunteer: {
      create: {
        url: `${base}campaign/volunteer`,
        method: 'POST',
        withAuth: true,
      },
      delete: {
        url: `${base}campaign/volunteer`,
        method: 'DELETE',
        withAuth: true,
      },
      update: {
        url: `${base}campaign/volunteer`,
        method: 'PATCH',
        withAuth: true,
      },
      list: {
        url: `${base}campaign/volunteers`,
        method: 'GET',
        withAuth: true,
      },
      listByUser: {
        url: `${base}campaign/volunteer-by-user`,
        method: 'GET',
        withAuth: true,
      },

      routes: {
        list: {
          url: `${base}campaign/volunteer/routes`,
          method: 'GET',
          withAuth: true,
        },
        find: {
          url: `${base}campaign/volunteer/route`,
          method: 'GET',
          withAuth: true,
        },
        claim: {
          url: `${base}campaign/volunteer/route/claim`,
          method: 'PUT',
          withAuth: true,
        },
        unclaim: {
          url: `${base}campaign/volunteer/route/unclaim`,
          method: 'PUT',
          withAuth: true,
        },
      },
      voter: {
        find: {
          url: `${base}voter`,
          method: 'GET',
          withAuth: true,
        },
      },
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

  doorKnocking: {
    create: {
      url: `${base}campaign/door-knocking`,
      method: 'POST',
      withAuth: true,
    },
    update: {
      url: `${base}campaign/door-knocking`,
      method: 'PUT',
      withAuth: true,
    },
    archive: {
      url: `${base}campaign/door-knocking/archive`,
      method: 'PUT',
      withAuth: true,
    },
    list: {
      url: `${base}campaign/door-knockings`,
      method: 'GET',
      withAuth: true,
    },
    get: {
      url: `${base}campaign/door-knocking`,
      method: 'GET',
      withAuth: true,
    },
    delete: {
      url: `${base}campaign/door-knocking`,
      method: 'DELETE',
      withAuth: true,
    },
    route: {
      find: {
        url: `${base}campaign/door-knocking/route`,
        method: 'GET',
        withAuth: true,
      },
    },
    survey: {
      create: {
        url: `${base}campaign/door-knocking/survey`,
        method: 'POST',
        withAuth: true,
      },
      find: {
        url: `${base}campaign/door-knocking/survey`,
        method: 'GET',
        withAuth: true,
      },
      complete: {
        url: `${base}campaign/door-knocking/complete-survey`,
        method: 'PUT',
        withAuth: true,
      },
      skip: {
        url: `${base}campaign/door-knocking/skip-survey`,
        method: 'PUT',
        withAuth: true,
      },
      download: {
        url: `${base}campaign/door-knocking/download`,
        method: 'GET',
        withAuth: true,
      },
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
