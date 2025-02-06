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
      path: '/campaigns/mine',
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
  content: {
    getByType: {
      path: '/content/type/:type',
      method: 'GET',
    },
    getById: {
      path: '/content/:id',
      method: 'GET',
    },
    glossaryBySlug: {
      path: '/content/type/glossaryItem/by-slug',
      method: 'GET',
    },
    glossaryByLetter: {
      path: '/content/type/glossaryItem/by-letter',
      method: 'GET',
    },
    articleTags: {
      path: '/content/article-tags',
      method: 'GET',
    },
    getBlogSections: {
      path: '/content/blog-articles-by-section',
      method: 'GET',
    },
    blogArticle: {
      getBySlug: {
        path: '/content/blog-article/:slug',
        method: 'GET',
      },
      getBySection: {
        path: '/content/blog-articles-by-section/:sectionSlug',
        method: 'GET',
      },
      getByTag: {
        path: '/content/blog-articles-by-tag/:tag',
        method: 'GET',
      },
    },
  },
  topIssue: {
    create: {
      path: '/top-issues',
      method: 'POST',
    },
    update: {
      path: '/top-issues/:id',
      method: 'PUT',
    },
    delete: {
      path: '/top-issues/:id',
      method: 'DELETE',
    },
    list: {
      path: '/top-issues',
      method: 'GET',
    },
    position: {
      create: {
        path: '/positions',
        method: 'POST',
      },
      update: {
        path: '/positions/:id',
        method: 'PUT',
      },
      delete: {
        path: '/positions/:id',
        method: 'DELETE',
      },
    },
  },
  voters: {
    locations: {
      path: '/voters/locations',
      method: 'GET',
    },
    voterFile: {
      get: {
        path: '/voters/voter-file',
        method: 'GET',
      },
      wakeUp: {
        path: '/voters/voter-file/wake-up',
        method: 'GET',
      },
      schedule: {
        path: '/voters/voter-file/schedule',
        method: 'POST',
      },
      helpMessage: {
        path: '/voters/voter-file/help-message',
        method: 'POST',
      },
      canDownload: {
        path: '/voters/voter-file/can-download',
        method: 'GET',
      },
    },
  },
  admin: {
    user: {
      list: {
        path: '/admin/users',
        method: 'GET',
      },
      create: {
        path: '/admin/users',
        method: 'POST',
      },
      delete: {
        path: '/admin/users/:id',
        method: 'DELETE',
      },
      impersonate: {
        path: '/admin/users/impersonate',
        method: 'POST',
      },
    },
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
      victoryMail: {
        path: '/admin/campaigns/:id/send-victory-email',
        method: 'POST',
      },
      proNoVoterFile: {
        path: '/admin/campaigns/pro-no-voter-file',
        method: 'GET',
      },
      p2vStats: {
        path: '/admin/campaigns/p2v-stats',
        method: 'GET',
      },
    },
  },
  jobs: {
    list: {
      path: '/jobs',
      method: 'GET',
    },
    find: {
      path: '/jobs/:id',
      method: 'GET',
    },
  },
  logError: {
    path: '/error-logger',
    method: 'POST',
  },
};
