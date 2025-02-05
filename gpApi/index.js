export let apiBase = process.env.NEXT_PUBLIC_API_BASE; // for server side calls.
if (!apiBase) {
  apiBase = 'https://api-dev.goodparty.org';
}

// CI environment variable is a flag provided by Vercel CI/CD to indicate runtime is during build.
//   If CI is true, then the API base is set to the NEXT_PUBLIC_API_BASE environment variable since
//   the Next.js app is currently being built and cannot be talked to, so build requests for static content
//   data should be directed to the API base, not the Next.js application proxy
export let appBase = Boolean(process.env.CI)
  ? process.env.NEXT_PUBLIC_API_BASE
  : process.env.NEXT_PUBLIC_APP_BASE;

let base = `${appBase}/api/v1/`;

export const isProd = apiBase === 'https://api.goodparty.org';

if (!appBase) {
  appBase =
    typeof window !== 'undefined'
      ? window.location.origin
      : `https://${process.env.VERCEL_BRANCH_URL}`;
  base = `${appBase}/api/v1/`;
}

const gpApi = {
  entrance: {
    twitterLogin: {
      url: `${base}entrance/twitter-login`,
      method: 'PUT',
    },
  },
  content: {
    contentByKey: {
      url: `${base}content/content-by-key`,
      method: 'GET',
    },
    articlesTitles: {
      url: `${base}content/blog-articles-titles`,
      method: 'GET',
    },
    articlesBySlug: {
      url: `${base}content/blog-articles-by-slug`,
      method: 'GET',
    },
    articlesBySection: {
      url: `${base}content/blog-articles-by-section`,
      method: 'GET',
    },
    articlesByTag: {
      url: `${base}content/blog-articles-by-tag`,
      method: 'GET',
    },
    articleTags: {
      url: `${base}content/article-tags`,
      method: 'GET',
    },
  },

  campaign: {
    createDemoCampaign: {
      url: `${base}campaign/demo`,
      method: 'POST',
      withAuth: true,
    },
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

  topIssues: {
    byLocation: {
      url: `${base}top-issue/by-location`, // non admin, for onboarding
      method: 'GET',
      withAuth: true,
    },
  },

  //
  // USER
  //
  user: {
    logout: {
      url: `${base}entrance/logout`,
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

  uploadBase64Image: {
    url: `${base}upload-base64-image`,
    method: 'POST',
    withAuth: true,
  },

  ballotData: {
    races: {
      url: `${base}ballot-data/races`,
      method: 'GET',
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
  voterData: {
    locations: {
      url: `${base}voter-data/locations`,
      method: 'GET',
      withAuth: true,
    },
    pathToVictory: {
      url: `${base}voter-data/path-to-victory`,
      method: 'POST',
      withAuth: true,
    },
    getVoterFile: {
      url: `${base}voter-data/voter-file`,
      method: 'GET',
      withAuth: true,
    },
    wakeUp: {
      url: `${base}voter-data/voter-file/wake-up`,
      method: 'GET',
      withAuth: true,
    },
    schedule: {
      url: `${base}voter-data/voter-file/schedule`,
      method: 'POST',
      withAuth: true,
    },
    helpMessage: {
      url: `${base}voter-data/voter-file/help-message`,
      method: 'POST',
      withAuth: true,
    },
    canDownload: {
      url: `${base}voter-data/voter-file/can-download`,
      method: 'GET',
      withAuth: true,
    },
  },
  payments: {
    createCheckoutSession: {
      url: `${base}payments/purchase/checkout-session`,
      method: 'POST',
      withAuth: true,
    },
    updateCheckoutSession: {
      url: `${base}payments/purchase/checkout-session`,
      method: 'PATCH',
      withAuth: true,
    },
    deleteCheckoutSession: {
      url: `${base}payments/purchase/checkout-session`,
      method: 'DELETE',
      withAuth: true,
    },
    createPortalSession: {
      url: `${base}payments/purchase/portal-session`,
      method: 'POST',
      withAuth: true,
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

// replacing all non authenticated routes with apiBase
replaceBase(gpApi);

function replaceBase(obj) {
  Object.keys(obj).forEach((key) => {
    if (obj[key].url && typeof obj[key].url === 'string') {
      if (!obj[key].withAuth) {
        obj[key].url = obj[key].url.replace(appBase, apiBase);
      }
    } else if (typeof obj[key] === 'object') {
      replaceBase(obj[key]);
    }
  });
}

export default gpApi;
