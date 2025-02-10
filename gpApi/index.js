let apiBase = process.env.NEXT_PUBLIC_API_BASE; // for server side calls.
if (!apiBase) {
  apiBase = 'https://api-dev.goodparty.org';
}

// CI environment variable is a flag provided by Vercel CI/CD to indicate runtime is during build.
//   If CI is true, then the API base is set to the NEXT_PUBLIC_API_BASE environment variable since
//   the Next.js app is currently being built and cannot be talked to, so build requests for static content
//   data should be directed to the API base, not the Next.js application proxy
let appBase = Boolean(process.env.CI)
  ? process.env.NEXT_PUBLIC_API_BASE
  : process.env.NEXT_PUBLIC_APP_BASE;

let base = `${appBase}/api/v1/`;

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
    pathToVictory: {
      // TODO: not migrated to nest yet!!!
      url: `${base}voter-data/path-to-victory`,
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
