const apiBase =
  process.env.NEXT_PUBLIC_API_BASE || 'https://api-dev.goodparty.org';
const base = `${apiBase}/api/v1/`;

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
  },
  entrance: {
    register: {
      url: `${base}entrance/register`,
      method: 'POST',
    },
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
  },
  content: {
    contentByKey: {
      url: `${base}content/content-by-key`,
      method: 'GET',
    },
  },
  candidate: {
    list: {
      url: `${base}new-candidates`,
      method: 'GET',
    },
    find: {
      url: `${base}new-candidate`,
      method: 'GET',
    },
  },

  campaign: {
    find: {
      url: `${base}campaign`,
      method: 'GET',
      withAuth: true,
    },
    update: {
      url: `${base}campaign`,
      method: 'PUT',
      withAuth: true,
    },
    stats: {
      url: `${base}campaign/stats`,
      method: 'GET',
      withAuth: true,
    },
    claim: {
      url: `${base}campaign/claim`,
      method: 'POST',
    },
    role: {
      url: `${base}campaign/staff-role`,
      method: 'GET',
      withAuth: true,
    },
    staff: {
      userStaff: {
        url: `${base}user/staff`,
        method: 'GET',
        withAuth: true,
      },
    },
  },

  candidateApplication: {
    uploadImage: {
      url: `${base}application/upload-image`,
      method: 'POST',
    },
  },

  candidateApplication: {
    create: {
      url: `${base}application`,
      method: 'POST',
      withAuth: true,
    },
    delete: {
      url: `${base}application`,
      method: 'DELETE',
      withAuth: true,
    },
    list: {
      url: `${base}applications`,
      method: 'GET',
      withAuth: true,
    },
    find: {
      url: `${base}application`,
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
    topIssues: {
      list: {
        url: `${base}top-issues`, // non admin
        method: 'GET',
      },
    },
  },
};

export default gpApi;
