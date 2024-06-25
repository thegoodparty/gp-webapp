export let apiBase = process.env.NEXT_PUBLIC_API_BASE; // for server side calls.
export let appBase = process.env.NEXT_PUBLIC_APP_BASE;

if (!apiBase && typeof window !== 'undefined') {
  // client side
  if (window.location.host === 'localhost:4000') {
    appBase = 'http://localhost:4000';
  }
  if (window.location.host === 'dev.goodparty.org') {
    appBase = 'https://dev.goodparty.org';
  }
  if (window.location.host === 'qa.goodparty.org') {
    appBase = 'https://qa.goodparty.org';
  }
  if (window.location.host === 'goodparty.org') {
    appBase = 'https://goodparty.org';
  }
}

const base = `${apiBase}/api/v1/`;

export const isProd = apiBase === 'https://api.goodparty.org';

const gpApi = {
  homepage: {
    subscribeEmail: {
      url: `${base}subscribe/email`,
      method: 'GET',
    },
    declarationSignatures: {
      list: {
        url: `${base}declares`,
        method: 'GET',
      },
    },
  },
  entrance: {
    // register: {
    //   url: `${base}entrance/register`,
    //   method: 'POST',
    // },
    login: {
      url: `${base}entrance/login`,
      method: 'PUT',
    },
    forgotPassword: {
      url: `${base}entrance/send-password-recovery-email`,
      method: 'POST',
    },
    resetPassword: {
      url: `${base}entrance/reset-password`,
      method: 'PUT',
    },
    socialLogin: {
      url: `${base}entrance/social-login`,
      method: 'PUT',
    },
    twitterLogin: {
      url: `${base}entrance/twitter-login`,
      method: 'PUT',
    },
    verifyTwitterToken: {
      url: `${base}entrance/twitter-confirm`,
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
    articlesBySection: {
      url: `${base}content/blog-articles-by-section`,
      method: 'GET',
    },
    articlesByTag: {
      url: `${base}content/blog-articles-by-tag`,
      method: 'GET',
    },
  },

  campaign: {
    create: {
      url: `${base}campaign`,
      method: 'POST',
      withAuth: true,
    },
    update: {
      url: `${base}campaign`,
      method: 'PUT',
      withAuth: true,
    },
    get: {
      url: `${base}campaign`,
      method: 'GET',
      withAuth: true,
    },

    list: {
      //admin
      url: `${base}campaigns`,
      method: 'GET',
      withAuth: true,
    },

    launch: {
      url: `${base}campaign/launch`,
      method: 'POST',
      withAuth: true,
    },

    findBySlug: {
      //admin
      url: `${base}campaign/by-slug`,
      method: 'GET',
      withAuth: true,
    },

    adminUpdate: {
      url: `${base}campaign-admin`,
      method: 'PUT',
      withAuth: true,
    },

    UpdateHistory: {
      create: {
        url: `${base}campaign/update-history`,
        method: 'POST',
        withAuth: true,
      },
      list: {
        url: `${base}campaign/update-histories`,
        method: 'GET',
        withAuth: true,
      },
      delete: {
        url: `${base}campaign/update-history`,
        method: 'DELETE',
        withAuth: true,
      },
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

    campaignVolunteer: {
      create: {
        url: `${base}campaign/volunteer`,
        method: 'POST',
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

    candidatePosition: {
      create: {
        url: `${base}candidate-position`,
        method: 'POST',
        withAuth: true,
      },
      update: {
        url: `${base}candidate-position`,
        method: 'PUT',
        withAuth: true,
      },
      delete: {
        url: `${base}candidate-position`,
        method: 'DELETE',
        withAuth: true,
      },
      list: {
        url: `${base}candidate-positions`,
        method: 'GET',
        withAuth: true,
      },
      // find: {
      //   url: `${base}candidate-position`,
      //   method: 'GET',
      // },
      find: {
        url: `${base}campaign-position`,
        method: 'GET',
      },
    },

    ai: {
      create: {
        url: `${base}campaign/ai`,
        method: 'POST',
        withAuth: true,
      },
      edit: {
        url: `${base}campaign/ai`,
        method: 'PUT',
        withAuth: true,
      },
      rename: {
        url: `${base}campaign/ai/rename`,
        method: 'POST',
        withAuth: true,
      },
      delete: {
        url: `${base}campaign/ai`,
        method: 'DELETE',
        withAuth: true,
      },
    },

    onboarding: {
      adminDelete: {
        url: `${base}campaign`,
        method: 'DELETE',
        withAuth: true,
      },
      adminUpdate: {
        url: `${base}campaign-admin`,
        method: 'PUT',
        withAuth: true,
      },

      planVersions: {
        url: `${base}campaign/onboarding/planVersion`,
        method: 'GET',
        withAuth: true,
      },
    },
    einCheck: {
      url: `${base}campaign/ein-check`,
      method: 'GET',
      withAuth: true,
      returnFullResponse: true,
    },
    einSupportingDocumentUpload: {
      url: `${base}campaign/ein-support-document`,
      method: 'POST',
      withAuth: true,
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
      url: `${base}user`,
      method: 'PUT',
      withAuth: true,
    },
    refresh: {
      url: `${base}user/refresh`,
      method: 'PUT',
      withAuth: true,
    },
    logout: {
      url: `${base}user/logout`,
      method: 'PUT',
      withAuth: true,
    },
    changePassword: {
      url: `${base}user/password`,
      method: 'PUT',
      withAuth: true,
    },
    deleteAccount: {
      url: `${base}user`,
      method: 'DELETE',
      withAuth: true,
    },
    campaignStatus: {
      url: `${base}user/campaign-status`,
      method: 'GET',
      withAuth: true,
    },
    follow: {
      list: {
        url: `${base}supports`,
        method: 'GET',
        withAuth: true,
      },
      create: {
        url: `${base}support`,
        method: 'POST',
        withAuth: true,
      },
      delete: {
        url: `${base}support`,
        method: 'DELETE',
        withAuth: true,
      },
    },
    uploadAvatar: {
      url: `${base}user/avatar`,
      method: 'POST',
      withAuth: true,
    },
  },
  //
  // admin
  //
  admin: {
    victoryMail: {
      url: `${base}admin/victory-mail`,
      method: 'POST',
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
    url: `${base}log-error`,
    method: 'POST',
  },
  notification: {
    list: {
      url: `${base}notifications`,
      method: 'GET',
      withAuth: true,
    },
    update: {
      url: `${base}notification`,
      method: 'PUT',
      withAuth: true,
    },
    updatePreferences: {
      url: `${base}notification-preferences`,
      method: 'PUT',
      withAuth: true,
    },
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
    // purchaseVoterFile: {
    //   url: `${base}voter-data/voter-file`, //admin
    //   method: 'POST',
    //   withAuth: true,
    // },
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
    // count: {
    //   url: `${base}voter-data/voter-file/count`, //admin
    //   method: 'PUT',
    //   withAuth: true,
    // },
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
    getPortalSessionRedirectUrl: {
      url: `${base}payments/purchase/portal-session`,
      method: 'GET',
      withAuth: true,
    },
  },
  candidate: {
    find: {
      url: `${base}candidate`,
      method: 'GET',
    },
  },
};

export default gpApi;
