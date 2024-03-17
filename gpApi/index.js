export let apiBase = process.env.NEXT_PUBLIC_API_BASE; // for server side calls.
export let appBase = process.env.NEXT_PUBLIC_APP_BASE;

if (!apiBase && typeof window !== 'undefined') {
  // client side
  if (window.location.host === 'localhost:4000') {
    apiBase === 'http://localhost:1337';
    appBase = 'http://localhost:4000';
  }
  if (window.location.host === 'dev.goodparty.org') {
    apiBase === 'https://api-dev.goodparty.org';
    appBase = 'https://dev.goodparty.org';
  }
  if (window.location.host === 'qa.goodparty.org') {
    apiBase === 'https://api-qa.goodparty.org';
    appBase = 'https://qa.goodparty.org';
  }
  if (window.location.host === 'goodparty.org') {
    apiBase === 'https://api.goodparty.org';
    appBase = 'https://goodparty.org';
  }
}

const base = `${apiBase}/api/v1/`;

export const isProd = apiBase === 'https://api.goodparty.org';

const gpApi = {
  homepage: {
    followers: {
      url: `${base}listening/followers-count`,
      method: 'GET',
    },
    homepageCandidates: {
      url: `${base}homepage-candidates`,
      method: 'GET',
    },
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
  candidate: {
    list: {
      url: `${base}candidates`,
      method: 'GET',
    },
    listOld: {
      url: `${base}new-candidates`,
      method: 'GET',
    },
    findOld: {
      url: `${base}new-candidate`,
      method: 'GET',
    },
    find: {
      url: `${base}candidate`,
      method: 'GET',
    },
    update: {
      url: `${base}candidate`,
      method: 'PUT',
      withAuth: true,
    },
    updateOld: {
      url: `${base}new-candidate`,
      method: 'PUT',
      withAuth: true,
    },
    trackVisit: {
      url: `${base}visit`,
      method: 'POST',
    },
    create: {
      url: `${base}new-candidate`,
      method: 'POST',
      withAuth: true,
    },
    canEdit: {
      url: `${base}candidate/can-edit`,
      method: 'GET',
      withAuth: true,
    },
  },

  campaign: {
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

    endorsement: {
      create: {
        url: `${base}campaign/endorsement`,
        method: 'POST',
        withAuth: true,
      },
      list: {
        url: `${base}campaign/endorsements`,
        method: 'GET',
        withAuth: true,
      },
      delete: {
        url: `${base}campaign/endorsement`,
        method: 'DELETE',
        withAuth: true,
      },
      update: {
        url: `${base}campaign/endorsement`,
        method: 'PUT',
        withAuth: true,
      },
    },

    onboarding: {
      create: {
        url: `${base}campaign/onboarding`,
        method: 'POST',
        withAuth: true,
      },
      update: {
        url: `${base}campaign/onboarding`,
        method: 'PUT',
        withAuth: true,
      },
      adminUpdate: {
        url: `${base}campaign/onboarding/admin-update`,
        method: 'PUT',
        withAuth: true,
      },
      delete: {
        url: `${base}campaign/onboarding`,
        method: 'DELETE',
        withAuth: true,
      },
      adminDelete: {
        url: `${base}campaign`,
        method: 'DELETE',
        withAuth: true,
      },
      findByUser: {
        url: `${base}campaign/onboarding/by-user`,
        method: 'GET',
        withAuth: true,
      },
      findBySlug: {
        //admin
        url: `${base}campaign/onboarding/by-slug`,
        method: 'GET',
        withAuth: true,
      },
      launchRequest: {
        url: `${base}campaign/onboarding/launch-request`,
        method: 'POST',
        withAuth: true,
      },
      cancelLaunchRequest: {
        // admin
        url: `${base}campaign/onboarding/launch-request`,
        method: 'DELETE',
        withAuth: true,
      },
      launch: {
        // admin
        url: `${base}campaign/onboarding/launch`,
        method: 'POST',
        withAuth: true,
      },
      list: {
        //admin
        url: `${base}campaign/onboardings`,
        method: 'GET',
        withAuth: true,
      },
      ai: {
        create: {
          url: `${base}campaign/onboarding/ai`,
          method: 'POST',
          withAuth: true,
        },
        fastCreate: {
          url: `${base}campaign/onboarding/fast-ai`,
          method: 'POST',
          withAuth: true,
        },
        edit: {
          url: `${base}campaign/onboarding/ai`,
          method: 'PUT',
          withAuth: true,
        },
        rename: {
          url: `${base}campaign/onboarding/ai/rename`,
          method: 'POST',
          withAuth: true,
        },
        delete: {
          url: `${base}campaign/onboarding/ai`,
          method: 'DELETE',
          withAuth: true,
        },
      },
      planVersions: {
        url: `${base}campaign/onboarding/planVersion`,
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
      url: `${base}user/update-user`,
      method: 'PUT',
      withAuth: true,
    },
    refresh: {
      url: `${base}user/refresh`,
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
  },
  voterData: {
    purchaseVoterFile: {
      url: `${base}voter-data/voter-file`, //admin
      method: 'POST',
      withAuth: true,
    },
    pathToVictory: {
      url: `${base}voter-data/path-to-victory`, //admin
      method: 'POST',
      withAuth: true,
    },
  },
};

export default gpApi;
