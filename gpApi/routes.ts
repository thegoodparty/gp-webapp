export interface ApiRoute {
  path: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  nextApiRoute?: boolean
  withAuth?: boolean
  returnFullResponse?: boolean
  additionalRequestOptions?: RequestInit
}

export const apiRoutes = {
  contactEngagement: {
    issues: {
      path: '/contact-engagement/:id/issues',
      method: 'GET',
    },
    activities: {
      path: '/contact-engagement/:id/activities',
      method: 'GET',
    },
  },
  contacts: {
    list: {
      path: '/contacts',
      method: 'GET',
    },
    get: {
      path: '/contacts/:id',
      method: 'GET',
    },
    download: {
      path: '/contacts/download',
      method: 'GET',
    },
  },
  polls: {
    list: {
      path: '/polls',
      method: 'GET',
    },
    get: {
      path: '/polls/:pollId',
      method: 'GET',
    },
    topIssues: {
      path: '/polls/:pollId/top-issues',
      method: 'GET',
    },
    initialPoll: {
      path: '/polls/initial-poll',
      method: 'POST',
    },
    imageUploadUrl: {
      path: '/polls/image-upload-url',
      method: 'POST',
    },
    analyzeBias: {
      path: '/polls/analyze-bias',
      method: 'POST',
    },
    hasPolls: {
      path: '/polls/has-polls',
      method: 'GET',
    },
    downloadResponses: {
      path: '/polls/:pollId/download-responses',
      method: 'GET',
    },
  },
  electedOffice: {
    current: {
      path: '/elected-office/current',
      method: 'GET',
    },
  },
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
    district: {
      path: '/campaigns/mine/district',
      method: 'PUT',
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
    legacyTasks: {
      list: {
        path: '/campaigns/legacy-tasks',
        method: 'GET',
      },
      complete: {
        path: '/campaigns/legacy-tasks/complete/:taskId',
        method: 'PUT',
      },
      delete: {
        path: '/campaigns/legacy-tasks/:taskId',
        method: 'DELETE',
      },
    },
    tasks: {
      list: {
        path: '/campaigns/tasks',
        method: 'GET',
      },
      generate: {
        path: '/campaigns/tasks/generate',
        method: 'POST',
      },
      generateStream: {
        path: '/campaigns/tasks/generate/stream',
        method: 'GET',
      },
      complete: {
        path: '/campaigns/tasks/complete/:taskId',
        method: 'PUT',
      },
      revert: {
        path: '/campaigns/tasks/complete/:taskId',
        method: 'DELETE',
      },
      delete: {
        path: '/campaigns/tasks/:taskId',
        method: 'DELETE',
      },
      deleteAll: {
        path: '/campaigns/tasks',
        method: 'DELETE',
      },
    },
    tcrCompliance: {
      fetch: {
        path: '/campaigns/tcr-compliance/mine',
        method: 'GET',
      },
      create: {
        path: '/campaigns/tcr-compliance',
        method: 'POST',
      },
      submitCvPin: {
        path: '/campaigns/tcr-compliance/:tcrComplianceId/submit-cv-pin',
        method: 'POST',
      },
    },
    raceTargetDetails: {
      update: {
        path: '/campaigns/mine/race-target-details',
        method: 'PUT',
      },
      adminUpdate: {
        path: '/campaigns/admin/:slug/race-target-details',
        method: 'PUT',
      },
    },
  },
  content: {
    getByType: {
      path: '/content/type/:type',
      method: 'GET',
    },
    byType: {
      path: '/content/type',
      method: 'GET',
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
    byLocation: {
      path: '/top-issues/by-location',
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
  voterFileFilter: {
    create: {
      path: '/voters/voter-file/filter',
      method: 'POST',
    },
    list: {
      path: '/voters/voter-file/filters',
      method: 'GET',
    },
    update: {
      path: '/voters/voter-file/filter/:id',
      method: 'PUT',
    },
    delete: {
      path: '/voters/voter-file/filter/:id',
      method: 'DELETE',
    },
  },
  elections: {
    racesByYear: {
      path: '/elections/races-by-year',
      method: 'GET',
    },
    districts: {
      types: {
        path: '/elections/districts/types',
        method: 'GET',
      },
      names: {
        path: '/elections/districts/names',
        method: 'GET',
      },
    },
  },
  payments: {
    createCheckoutSession: {
      path: '/payments/purchase/checkout-session',
      method: 'POST',
    },
    createPortalSession: {
      path: '/payments/purchase/portal-session',
      method: 'POST',
    },
    createCustomCheckoutSession: {
      path: '/payments/purchase/create-checkout-session',
      method: 'POST',
    },
    completeCheckoutSession: {
      path: '/payments/purchase/complete-checkout-session',
      method: 'POST',
    },
    completeFreePurchase: {
      path: '/payments/purchase/complete-free-purchase',
      method: 'POST',
    },
  },
  logError: {
    path: '/error-logger',
    method: 'POST',
  },
  ecanvasser: {
    list: {
      path: '/ecanvasser/list',
      method: 'GET',
    },
    create: {
      path: '/ecanvasser',
      method: 'POST',
    },
    sync: {
      path: '/ecanvasser/:campaignId/sync',
      method: 'POST',
    },
    syncAll: {
      path: '/ecanvasser/sync-all',
      method: 'GET',
    },
    delete: {
      path: '/ecanvasser/:campaignId',
      method: 'DELETE',
    },
    mine: {
      path: '/ecanvasser/mine',
      method: 'GET',
    },
    mySummary: {
      path: '/ecanvasser/mine/summary',
      method: 'GET',
    },
    surveys: {
      list: {
        path: '/ecanvasser/surveys',
        method: 'GET',
      },
      find: {
        path: '/ecanvasser/survey/:id',
        method: 'GET',
      },
      create: {
        path: '/ecanvasser/survey',
        method: 'POST',
      },
      update: {
        path: '/ecanvasser/survey/:id',
        method: 'PUT',
      },
      delete: {
        path: '/ecanvasser/survey/:id',
        method: 'DELETE',
      },
      questions: {
        create: {
          path: '/ecanvasser/survey/:id/question',
          method: 'POST',
        },
        delete: {
          path: '/ecanvasser/survey/question/:questionId',
          method: 'DELETE',
        },
        update: {
          path: '/ecanvasser/survey/question/:questionId',
          method: 'PUT',
        },
        find: {
          path: '/ecanvasser/survey/question/:questionId',
          method: 'GET',
        },
      },
    },
    teams: {
      list: {
        path: '/ecanvasser/teams',
        method: 'GET',
      },
    },
  },
  textMessaging: {
    list: {
      path: '/text-campaigns',
      method: 'GET',
    },
  },
  issues: {
    get: {
      path: '/community-issues/:uuid',
      method: 'GET',
    },
    getStatusHistory: {
      path: '/community-issues/:uuid/status-history',
      method: 'GET',
    },
    list: {
      path: '/community-issues',
      method: 'GET',
    },
    create: {
      path: '/community-issues',
      method: 'POST',
    },
    update: {
      path: '/community-issues/:uuid',
      method: 'PUT',
    },
  },
  outreach: {
    create: {
      path: '/outreach',
      method: 'POST',
    },
    list: {
      path: '/outreach',
      method: 'GET',
    },
  },
  p2p: {
    createPhoneList: {
      path: '/p2p/phone-list',
      method: 'POST',
    },
    phoneListStatus: {
      path: '/p2p/phone-list/:phoneListToken/status',
      method: 'GET',
    },
  },
  website: {
    get: {
      path: '/websites/mine',
      method: 'GET',
    },
    create: {
      path: '/websites',
      method: 'POST',
    },
    update: {
      path: '/websites/mine',
      method: 'PUT',
    },
    preview: {
      path: '/websites/:vanityPath/preview',
      method: 'GET',
    },
    view: {
      path: '/websites/:vanityPath/view',
      method: 'GET',
    },
    getContacts: {
      path: '/websites/mine/contacts',
      method: 'GET',
    },
    getViews: {
      path: '/websites/mine/views',
      method: 'GET',
    },
    submitContactForm: {
      path: '/websites/:vanityPath/contact-form',
      method: 'POST',
    },
    validateVanityPath: {
      path: '/websites/validate-vanity-path',
      method: 'POST',
    },
    trackView: {
      path: '/websites/:vanityPath/track-view',
      method: 'POST',
    },
  },
  domain: {
    search: {
      path: '/domains/search',
      method: 'GET',
    },
    register: {
      path: '/domains',
      method: 'POST',
    },
    completeRegistration: {
      path: '/domains/complete',
      method: 'POST',
    },
    delete: {
      path: '/domains/:id',
      method: 'DELETE',
    },
    status: {
      path: '/domains/status',
      method: 'GET',
    },
  },
} as const
