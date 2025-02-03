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

let base = `${appBase}/v1/`;

export const isProd = apiBase === 'https://api.goodparty.org';

if (!appBase) {
  appBase =
    typeof window !== 'undefined'
      ? window.location.origin
      : `https://${process.env.VERCEL_BRANCH_URL}`;
  base = `${appBase}/v1/`;
}

const gpApi = {
  homepage: {
    subscribeEmail: {
      url: `${base}subscribe`,
      method: 'POST',
    },
    declarationSignatures: {
      list: {
        url: `${base}declare/list`,
        method: 'GET',
      },
    },
  },
  // TODO: rename to authentication?
  entrance: {
    register: {
      url: `${base}authentication/register`,
      method: 'POST',
    },
    login: {
      url: `${base}authentication/login`,
      method: 'POST',
    },
    forgotPassword: {
      url: `${base}authentication/send-recover-password-email`,
      method: 'POST',
    },
    resetPassword: {
      url: `${base}authentication/reset-password`,
      method: 'POST',
    },
    socialLogin: {
      url: `${base}authentication/social-login/:socialProvider`,
      method: 'POST',
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
    create: {
      url: `${base}campaigns`,
      method: 'POST',
      withAuth: true,
    },
    adminCreate: {
      url: `${base}admin/campaigns`, // TODO: move to admin section
      method: 'POST',
      withAuth: true,
    },
    adminCreateEmail: {
      url: `${base}authentication/send-set-password-email`, // TODO: move to entrance/auth section
      method: 'POST',
      withAuth: true,
    },
    createDemoCampaign: {
      url: `${base}campaign/demo`, // TODO: remove? (not migrated)
      method: 'POST',
      withAuth: true,
    },
    deleteDemoCampaign: {
      url: `${base}campaign/demo`, // TODO: remove? (not migrated)
      method: 'DELETE',
      withAuth: true,
    },
    update: {
      url: `${base}campaigns/mine`,
      method: 'PUT',
      withAuth: true,
    },
    get: {
      url: `${base}campaigns/mine`,
      method: 'GET',
      withAuth: true,
    },

    list: {
      //admin
      url: `${base}campaigns`,
      method: 'GET',
      withAuth: true,
    },

    mapList: {
      url: `${base}campaigns/map`,
      method: 'GET',
    },
    mapCount: {
      url: `${base}campaigns/map/count`,
      method: 'GET',
    },

    launch: {
      url: `${base}campaigns/launch`,
      method: 'POST',
      withAuth: true,
    },

    findBySlug: {
      //admin
      url: `${base}campaigns/slug/:slug`,
      method: 'GET',
      withAuth: true,
    },

    adminUpdate: {
      url: `${base}admin/campaigns/:id`, // TODO: move to admin section?
      method: 'PUT',
      withAuth: true,
    },

    chat: {
      get: {
        url: `${base}campaigns/ai/chat/:threadId`,
        method: 'GET',
        withAuth: true,
      },
      update: {
        url: `${base}campaigns/ai/chat/:threadId`,
        method: 'PUT',
        withAuth: true,
      },
      create: {
        url: `${base}campaigns/ai/chat`,
        method: 'POST',
        withAuth: true,
      },
      list: {
        url: `${base}campaigns/ai/chat`,
        method: 'GET',
        withAuth: true,
      },
      delete: {
        url: `${base}campaigns/ai/chat/:threadId`,
        method: 'DELETE',
        withAuth: true,
      },
      feedback: {
        url: `${base}campaigns/ai/chat/:threadId/feedback`,
        method: 'POST',
        withAuth: true,
      },
    },

    UpdateHistory: {
      create: {
        url: `${base}campaigns/mine/update-history`,
        method: 'POST',
        withAuth: true,
      },
      list: {
        url: `${base}campaigns/mine/update-history`,
        method: 'GET',
        withAuth: true,
      },
      delete: {
        url: `${base}campaigns/mine/update-history/:id`,
        method: 'DELETE',
        withAuth: true,
      },
    },

    // TODO: remove? volunteerInvitation (not migrated)
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
    // TODO: remove? campaignRequests (not migrated)
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
    // TODO: remove campaignVolunteer? (not migrated)
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
      // TODO: remove routes? (not migrated)
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

    campaignPosition: {
      create: {
        url: `${base}campaigns/:id/positions`,
        method: 'POST',
        withAuth: true,
      },
      update: {
        url: `${base}campaigns/:id/positions/:positionId`,
        method: 'PUT',
        withAuth: true,
      },
      delete: {
        url: `${base}campaigns/:id/positions/:positionId`,
        method: 'DELETE',
        withAuth: true,
      },
      find: {
        url: `${base}campaigns/:id/positions`,
        method: 'GET',
        withAuth: true,
      },
    },

    ai: {
      create: {
        url: `${base}campaigns/ai`,
        method: 'POST',
        withAuth: true,
      },
      rename: {
        url: `${base}campaigns/ai/rename`,
        method: 'PUT',
        withAuth: true,
      },
      delete: {
        url: `${base}campaigns/ai/:key`,
        method: 'DELETE',
        withAuth: true,
      },
    },

    onboarding: {
      adminDelete: {
        url: `${base}admin/campaigns/:id`, // TODO: move to admin section?
        method: 'DELETE',
        withAuth: true,
      },
      adminUpdate: {
        url: `${base}admin/campaigns/:id`, // TODO: move to admin section?
        method: 'PUT',
        withAuth: true,
      },

      planVersions: {
        url: `${base}campaigns/mine/plan-version`, // TODO: move into up campaign section?
        method: 'GET',
        withAuth: true,
      },
    },
  },

  topIssues: {
    create: {
      url: `${base}top-issue`,
      method: 'POST',
      withAuth: true,
    },
    update: {
      url: `${base}top-issue`,
      method: 'PUT',
      withAuth: true,
    },
    delete: {
      url: `${base}top-issue`,
      method: 'DELETE',
      withAuth: true,
    },
    list: {
      url: `${base}top-issues`, // non admin
      method: 'GET',
    },
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
    updateUser: {
      url: `${base}users/me`,
      method: 'PUT',
      withAuth: true,
    },
    updateMeta: {
      url: `${base}users/me/metadata`,
      method: 'PUT',
      withAuth: true,
    },
    getMeta: {
      url: `${base}users/me/metadata`,
      method: 'GET',
      withAuth: true,
    },
    getUser: {
      url: `${base}users/me`,
      method: 'GET',
      withAuth: true,
    },
    logout: {
      url: `${appBase}/api/v1/entrance/logout`, // TODO: update logout handler to not have `/api` path?
      method: 'DELETE',
      withAuth: true,
    },
    changePassword: {
      url: `${base}users/:id/password`,
      method: 'PUT',
      withAuth: true,
    },
    deleteAccount: {
      url: `${base}users/:id`,
      method: 'DELETE',
      withAuth: true,
    },
    campaignStatus: {
      url: `${base}campaigns/mine/status`, // TODO: move to campaign section?
      method: 'GET',
      withAuth: true,
    },
    uploadAvatar: {
      url: `${base}users/me/upload-image`,
      method: 'POST',
      withAuth: true,
    },
    files: {
      generateSignedUploadUrl: {
        url: `${base}users/files/generate-signed-upload-url`,
        method: 'PUT',
        withAuth: true,
      },
    },
  },
  //
  // admin
  //
  admin: {
    isAdmin: {
      url: `${base}admin/is-admin`,
      method: 'GET',
      withAuth: true,
    },
    victoryMail: {
      url: `${base}admin/victory-mail`,
      method: 'POST',
      withAuth: true,
    },
    proNoVoterFile: {
      url: `${base}admin/campaign/pro-no-voter-file`,
      method: 'GET',
      withAuth: true,
    },

    enhanceCandidates: {
      url: `${base}admin/candidate-enhance`,
      method: 'POST',
      withAuth: true,
    },

    deactivateCandidate: {
      url: `${base}admin/deactivate-candidate-by-campaign`,
      method: 'PUT',
      withAuth: true,
    },
    topIssues: {
      create: {
        url: `${base}top-issue`,
        method: 'POST',
        withAuth: true,
      },
      update: {
        url: `${base}top-issue`,
        method: 'PUT',
        withAuth: true,
      },
      delete: {
        url: `${base}top-issue`,
        method: 'DELETE',
        withAuth: true,
      },
      list: {
        url: `${base}top-issues`, // non admin
        method: 'GET',
      },
    },

    position: {
      create: {
        url: `${base}position`,
        method: 'POST',
        withAuth: true,
      },
      update: {
        url: `${base}position`,
        method: 'PUT',
        withAuth: true,
      },
      delete: {
        url: `${base}position`,
        method: 'DELETE',
        withAuth: true,
      },
      list: {
        url: `${base}positions`, // non admin
        method: 'GET',
      },
    },
    uploadedImages: {
      url: `${base}admin/uploaded-images`,
      method: 'POST',
      withAuth: true,
    },
    uploadImage: {
      url: `${base}admin/upload-image`,
      method: 'POST',
      withAuth: true,
    },
    candidates: {
      url: `${base}admin/candidates`,
      method: 'GET',
      withAuth: true,
    },
    hiddenCandidates: {
      url: `${base}admin/hidden-candidates`,
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

    users: {
      url: `${base}admin/users`,
      method: 'GET',
      withAuth: true,
    },
    createUser: {
      url: `${base}admin/user`,
      method: 'POST',
      withAuth: true,
    },
    deleteUser: {
      url: `${base}admin/user`,
      method: 'DELETE',
      withAuth: true,
    },
    impersonateUser: {
      url: `${base}admin/user/impersonate`,
      method: 'POST',
      withAuth: true,
    },
    p2vStats: {
      url: `${base}admin/p2v-stats`,
      method: 'GET',
      withAuth: true,
    },
  },
  uploadImage: {
    url: `${base}application/upload-image`,
    method: 'POST',
  },
  uploadBase64Image: {
    url: `${base}upload-base64-image`,
    method: 'POST',
    withAuth: true,
  },
  logError: {
    url: `${base}error-logger`,
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

  jobs: {
    list: {
      url: `${base}jobs`,
      method: 'GET',
    },
    find: {
      url: `${base}job`,
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
