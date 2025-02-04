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
  user: {
    updateUser: {
      path: '/users/me',
      method: 'PUT',
    },
    updateMeta: {
      path: '/users/me/metadata',
      method: 'PUT',
    },
    getMeta: {
      path: '/users/me/metadata',
      method: 'GET',
    },
    getUser: {
      path: '/users/me',
      method: 'GET',
    },
    changePassword: {
      path: '/users/:id/password',
      method: 'PUT',
    },
    deleteAccount: {
      path: '/users/:id',
      method: 'DELETE',
    },
    uploadAvatar: {
      path: '/users/me/upload-image',
      method: 'POST',
    },
    files: {
      generateSignedUploadUrl: {
        path: '/users/files/generate-signed-upload-url',
        method: 'PUT',
      },
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
    status: {
      path: '/campaigns/mine/status',
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
    ai: {
      create: {
        path: '/campaigns/ai',
        method: 'POST',
      },
      rename: {
        path: '/campaigns/ai/rename',
        method: 'PUT',
      },
      delete: {
        path: '/campaigns/ai/:key',
        method: 'DELETE',
      },
    },
    chat: {
      get: {
        path: '/campaigns/ai/chat/:threadId',
        method: 'GET',
      },
      update: {
        path: '/campaigns/ai/chat/:threadId',
        method: 'PUT',
      },
      create: {
        path: '/campaigns/ai/chat',
        method: 'POST',
      },
      list: {
        path: '/campaigns/ai/chat',
        method: 'GET',
      },
      delete: {
        path: '/campaigns/ai/chat/:threadId',
        method: 'DELETE',
      },
      feedback: {
        path: '/campaigns/ai/chat/:threadId/feedback',
        method: 'POST',
      },
    },
    updateHistory: {
      create: {
        path: '/campaigns/mine/update-history',
        method: 'POST',
      },
      list: {
        path: '/campaigns/mine/update-history',
        method: 'GET',
      },
      delete: {
        path: '/campaigns/mine/update-history/:id',
        method: 'DELETE',
      },
    },
    campaignPosition: {
      create: {
        path: '/campaigns/:id/positions',
        method: 'POST',
      },
      update: {
        path: '/campaigns/:id/positions/:positionId',
        method: 'PUT',
      },
      delete: {
        path: '/campaigns/:id/positions/:positionId',
        method: 'DELETE',
      },
      find: {
        path: '/campaigns/:id/positions',
        method: 'GET',
      },
    },
    planVersion: {
      path: '/campaigns/mine/plan-version',
      method: 'GET',
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
      delete: {
        path: '/admin/campaigns/:id',
        method: 'DELETE',
      },
    },
  },
  logError: {
    path: '/error-logger',
    method: 'POST',
  },
};
