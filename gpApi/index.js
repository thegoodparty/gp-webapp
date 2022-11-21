const apiBase = process.env.API_BASE || 'https://api-dev.goodparty.org';
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
  },
  follow: {
    list: {
      url: `${base}supports`,
      method: 'GET',
      withAuth: true,
    },
  },
  uploadAvatar: {
    url: `${base}user/avatar`,
    method: 'POST',
    withAuth: true,
  },
  candidateApplication: {
    uploadImage: {
      url: `${base}application/upload-image`,
      method: 'POST',
    },
  },

  //
  // USER
  //
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
};

export default gpApi;
