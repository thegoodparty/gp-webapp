const apiBase =
  process.env.NEXT_PUBLIC_API_BASE || 'https://api-dev.goodparty.org';

const versionBase = '/v1';

export const apiUrl = apiBase + versionBase;

export const isProd = apiBase === 'https://api.goodparty.org';

export const apiRoutes = {
  homepage: {
    subscribeEmail: {
      path: '/subscribe',
      method: 'POST',
    },
    declarationSignatures: {
      list: {
        path: '/declare/list',
        method: 'GET',
      },
    },
  },
  authentication: {
    register: {
      path: '/authentication/register',
      method: 'POST',
    },
    login: {
      path: '/authentication/login',
      method: 'POST',
    },
    forgotPassword: {
      path: '/authentication/send-recover-password-email',
      method: 'POST',
    },
    resetPassword: {
      path: '/authentication/reset-password',
      method: 'POST',
    },
    socialLogin: {
      path: '/authentication/social-login/:socialProvider',
      method: 'POST',
    },
    setSetPasswordEmail: {
      path: '/authentication/send-set-password-email',
      method: 'POST',
    },
  },
  campaign: {
    create: {
      path: '/campaigns',
      method: 'POST',
    },
    update: {
      path: '/campaigns',
      method: 'PUT',
    },
    get: {
      path: '/campaigns/mine',
      method: 'GET',
    },
    findBySlug: {
      path: '/campaigns/slug/:slug',
      method: 'GET',
    },
    list: {
      path: '/campaigns',
      method: 'GET',
    },
    launch: {
      path: '/campaigns/launch',
      method: 'POST',
    },
    map: {
      list: {
        path: '/campaigns/map',
        method: 'GET',
      },
      count: {
        path: '/campaigns/map/count',
        method: 'GET',
      },
    },
  },

  admin: {
    campaign: {
      create: {
        path: '/admin/campaigns',
        method: 'POST',
      },
      update: {
        path: '/admin/campaigns/:id',
        method: 'PUT',
      },
    },
  },
};
