import { kebabCase } from 'es-toolkit'
import { segmentTrackEvent } from './segmentHelper'
import cookie from 'js-cookie'
import { getUserCookie } from './cookieHelper'
import type { Analytics } from '@segment/analytics-next'

const UTM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
] as const

const CLID_SUFFIX = 'clid'

export const EVENTS = {
  polls: {
    resultsViewed: 'Polls - Poll Results Overview Viewed',
    issueDetailsViewed: 'Polls - Poll Results Issue Details Viewed',
  },
  createPoll: {
    createPollClicked: 'Polls - Create Poll Clicked',
    pollQuestionViewed: 'Polls - Poll Question Viewed',
    pollQuestionCompleted: 'Polls - Poll Question Completed',
    pollQuestionOptimized: 'Polls - Poll Question Optimized',
    pollBiasDetectionShown: 'Polls - Poll Bias Detection Shown',
    audienceSelectionViewed: 'Polls - Audience Selection Viewed',
    audienceSelectionCompleted: 'Polls - Audience Selection Completed',
    schedulePollViewed: 'Polls - Schedule Poll Viewed',
    schedulePollCompleted: 'Polls - Schedule Poll Completed',
    addImageViewed: 'Polls - Add Image Viewed',
    addImageCompleted: 'Polls - Add Image Completed',
    pollPreviewViewed: 'Polls - Poll Preview Viewed',
    pollPreviewCompleted: 'Polls - Poll Preview Completed',
    paymentViewed: 'Payment - Schedule and Pay Viewed',
    paymentCompleted: 'Payment - Completed',
  },
  expandPolls: {
    recommendationsViewed: 'Polls - Expand Poll Recommendations Viewed',
    recommendationsCompleted: 'Polls - Expand Poll Recommendations Completed',
    reviewViewed: 'Polls - Expand Poll Review Viewed',
    paymentViewed: 'Payment - Review and Pay Screen Viewed',
    paymentCompleted: 'Payment - Completed',
  },

  SignUp: {
    ClickLogin: 'Sign Up: Click Login',
  },
  SignIn: {
    ClickCreateAccount: 'Sign In: Click Create Account',
    ClickForgotPassword: 'Sign In: Click Forgot Password',
  },
  Password: {
    PasswordResetRequested: 'Account - Password Reset Requested',
    PasswordResetCompleted: 'Account - Password Reset Completed',
    PasswordSetCompleted: 'Account - Password Set Completed',
  },
  SetPassword: {
    ClickSetPassword: 'Set Password: Click Set Password',
  },
  Onboarding: {
    RegistrationCompleted: 'Onboarding - Registration Completed',
    ClickFinishLater: 'Onboarding: Click Finish Later',
    OfficeStep: {
      ClickNext: 'Onboarding - Office Step: Click Next',
      ClickBack: 'Onboarding - Office Step: Click Back',
      OfficeSelected: 'Onboarding - Office Step: Office Selected',
      ClickCantSeeOffice: "Onboarding - Office Step: Click Can't See Office",
      OfficeSearched: 'Onboarding - Candidate Office Searched',
      OfficeCompleted: 'Onboarding - Candidate Office Completed',
    },
    PartyStep: {
      ClickSubmit: 'Onboarding - Party Step: Click Submit',
      Completed: 'Onboarding - Candidate Affiliation Completed',
    },
    PledgeStep: {
      ClickAskQuestion: 'Onboarding - Pledge Step: Click Ask a Question',
      ClickSubmit: 'Onboarding - Pledge Step: Click Submit',
      Completed: 'Onboarding - Candidate Pledge Completed',
    },
    CompleteStep: {
      ClickGoToDashboard: 'Onboarding - Complete Step: Click Go to Dashboard',
    },
  },
  ServeOnboarding: {
    GettingStartedViewed: 'Serve Onboarding - Getting Started Viewed',
    MeetYourConstituentsViewed:
      'Serve Onboarding - Meet Your Constituents Viewed',
    SwornInViewed: 'Serve Onboarding - Sworn In Viewed',
    SwornInCompleted: 'Serve Onboarding - Sworn In Completed',
    ConstituencyProfileViewed: 'Serve Onboarding - Constituency Profile Viewed',
    PollValuePropsViewed: 'Serve Onboarding - Poll Value Props Viewed',
    PollStrategyViewed: 'Serve Onboarding - Poll Strategy Viewed',
    AddImageViewed: 'Serve Onboarding - Add Image Viewed',
    PollImageUploaded: 'Serve Onboarding - Poll Image Uploaded',
    PollPreviewViewed: 'Serve Onboarding - Poll Preview Viewed',
    SmsPollSent: 'Serve Onboarding - SMS Poll Sent',
    SuccessPageViewed: 'Serve Onboarding - Success Page Viewed',
  },
  Navigation: {
    Top: {
      ClickLogo: 'Navigation - Top: Click Logo',
      ClickAvatarDropdown: 'Navigation - Top: Click Avatar Dropdown',
      AvatarDropdown: {
        CloseDropdown: 'Navigation - Top - Avatar Dropdown: Close Dropdown',
        ClickSettings: 'Navigation Top - Avatar Dropdown: Click Settings',
        ClickLogout: 'Navigation Top - Avatar Dropdown: Click Logout',
      },
    },
    Dashboard: {
      ClickDashboard: 'Navigation - Dashboard: Click Dashboard',
      ClickAIAssistant: 'Navigation - Dashboard: Click AI Assistant',
      ClickVoterData: 'Navigation - Dashboard: Click Voter Data',
      ClickDoorKnocking: 'Navigation - Dashboard: Click Door Knocking',
      ClickIssues: 'Navigation - Dashboard: Click Issues',
      ClickContentBuilder: 'Navigation - Dashboard: Click Content Builder',
      ClickMyProfile: 'Navigation - Dashboard: Click My Profile',
      ClickCampaignTeam: 'Navigation - Dashboard: Click Campaign Team',
      ClickResources: 'Navigation - Dashboard: Click Resources',
      ClickCommunity: 'Navigation - Dashboard: Click Community',
      ClickWebsite: 'Navigation - Dashboard: Click Website',
      ClickVoterOutreach: 'Navigation - Dashboard: Click Voter Outreach',
      ClickContacts: 'Navigation - Dashboard: Click Contacts',
      ClickPolls: 'Navigation - Dashboard: Click Polls',
    },
  },
  Resources: {
    ResourceClicked: 'Resources - Resource Clicked',
  },
  Dashboard: {
    Viewed: 'Dashboard - Candidate Dashboard Viewed',
    PathToVictory: {
      ClickUnderstand:
        'Dashboard - Path to Victory: Click Understand Path to Victory',
      ExitUnderstand:
        'Dashboard - Path to Victory: Exit Understand Path to Victory',
      ClickContactsNeeded:
        'Dashboard - Path to Victory: Click Needed x,xxx Contacts',
      ClickLearnMore: 'Dashboard - Path to Victory: Click Learn More',
      LearnMore: {
        ClickAwareness:
          'Dashboard - Path to Victory: Click Learn More for Awareness',
        ClickContact:
          'Dashboard - Path to Victory: Click Learn More for Contact',
        ClickVote: 'Dashboard - Path to Victory: Click Learn More for Vote',
        Exit: 'Dashboard - Path to Victory: Exit About Phases Modal',
      },
    },
    VoterContact: {
      CampaignCompleted: 'Voter Outreach - Campaign Completed',
      LogProgress: {
        Exit: 'Dashboard - Voter Contact - Log Progress: Exit Log Progress',
        ClickAdd:
          'Dashboard - Voter Contact - Log Progress: Click Add Progress',
      },
      DoorKnocking: {
        ClickGenerateScript:
          'Dashboard - Voter Contact - Door Knocking: Click Generate Script',
        ClickGetDoorTargets:
          'Dashboard - Voter Contact - Door Knocking: Click Get Door Targets',
        ClickLogProgress:
          'Dashboard - Voter Contact - Door Knocking: Click Log Progress',
      },
      Texting: {
        ClickGenerateScript:
          'Dashboard - Voter Contact - Texting: Click Generate Script',
        ClickScheduleTextCampaign:
          'Dashboard - Voter Contact - Texting: Click Schedule Text Campaign',
        ClickLogProgress:
          'Dashboard - Voter Contact - Texting: Click Log Progress',
        ScheduleCampaign: {
          Exit: 'Schedule Text Campaign: Exit',
          Next: 'Schedule Text Campaign: Next',
          Back: 'Schedule Text Campaign: Back',
          Submit: 'Schedule Text Campaign: Submit',
          Complete: {
            ReturnToDashboard:
              'Schedule Text Campaign: Complete - Return to Dashboard',
            ReturnToVoterFile:
              'Schedule Text Campaign: Complete - Return to Voter File',
          },
          Audience: {
            CheckAudience: 'Schedule Text Campaign - Audience: Check Audience',
            CheckPoliticalParty:
              'Schedule Text Campaign - Audience: Check Political Party',
            CheckAge: 'Schedule Text Campaign - Audience: Check Age',
            CheckGender: 'Schedule Text Campaign - Audience: Check Gender',
            EnterRequest:
              'Schedule Text Campaign - Audience: Enter Audience Request',
          },
          Script: {
            ClickSaved:
              'Schedule Text Campaign - Script: Click Use a saved script',
            SelectSaved: 'Schedule Text Campaign - Script: Select Saved Script',
            ClickGenerate:
              'Schedule Text Campaign - Script: Click Generate a new script',
            ClickAdd:
              'Schedule Text Campaign - Script: Click Add your own script',
            SubmitAdd: 'Schedule Text Campaign - Script: Submit added script',
          },
        },
      },
      PhoneBanking: {
        ClickGenerateScript:
          'Dashboard - Voter Contact - Phone Banking: Click Generate Script',
        ClickGetPhoneTargets:
          'Dashboard - Voter Contact - Phone Banking: Click Get Phone Targets',
        ClickLogProgress:
          'Dashboard - Voter Contact - Phone Banking: Click Log Progress',
      },
      YardSigns: {
        ClickGenerateScript:
          'Dashboard - Voter Contact - Yard Signs: Click Generate Script',
        ClickLogProgress:
          'Dashboard - Voter Contact - Yard Signs: Click Log Progress',
      },
      DigitalAdvertising: {
        ClickGenerateScript:
          'Dashboard - Voter Contact - Digital Advertising: Click Generate Script',
        ClickExploreSmartAds:
          'Dashboard - Voter Contact - Digital Advertising: Click Explore Smart Ads',
        ClickLogProgress:
          'Dashboard - Voter Contact - Digital Advertising: Click Log Progress',
      },
      DirectMail: {
        ClickGenerateScript:
          'Dashboard - Voter Contact - Direct Mail: Click Generate Script',
        ClickGetMailTargets:
          'Dashboard - Voter Contact - Direct Mail: Click Get Mail Targets',
        ClickLogProgress:
          'Dashboard - Voter Contact - Direct Mail: Click Log Progress',
      },
      EventsRallies: {
        ClickGenerateScript:
          'Dashboard - Voter Contact - Events & Rallies: Click Generate Script',
        ClickLogProgress:
          'Dashboard - Voter Contact - Events & Rallies: Click Log Progress',
      },
    },
    ActionHistory: {
      ClickMenu: 'Dashboard - Campaign Action History: Click Menu',
      ClickDelete: 'Dashboard - Campaign Action History: Click Delete',
    },
  },
  Account: {
    ProSubscriptionCanceled: 'Account - Pro Subscription Canceled',
  },
  AIAssistant: {
    ClickNewChat: 'AI Assistant: Click new chat',
    ClickViewChatHistory: 'AI Assistant: Click view chat history',
    AskQuestion: 'AI Assistant: Ask a question',
    ChatHistory: {
      ClickMenu: 'AI Assistant - Chat History: Click menu',
      ClickDelete: 'AI Assistant - Chat History: Click delete',
    },
    Chat: {
      ClickThumbsUp: 'AI Assistant - Chat: Click thumbs up',
      ClickThumbsDown: 'AI Assistant - Chat: Click thumbs down',
      ClickRegenerate: 'AI Assistant - Chat: Click regenerate',
      ClickCopy: 'AI Assistant - Chat: Click copy',
    },
  },
  ProUpgrade: {
    ClickExit: 'Pro Upgrade: Click exit top nav',
    EditOffice: 'Pro Upgrade: Edit office',
    SubmitEditOffice: 'Pro Upgrade: Submit edit office',
    ConfirmOffice: 'Pro Upgrade: Confirm office',
    ExitEditOffice: 'Pro Upgrade: Exit edit office',
    Banner: {
      ClickUpgrade:
        'Pro Upgrade - Level Up Your Campaign Banner: Click upgrade',
    },
    Modal: {
      Shown: 'Pro Upgrade - Modal: Modal Shown',
      Exit: 'Pro Upgrade - Modal: Exit',
      ClickButton: 'Pro Upgrade - Modal: Click Button',
    },
    SplashPage: {
      ClickUpgrade: 'Pro Upgrade - Splash Page: Click upgrade',
      Exit: 'Pro Upgrade - Splash Page: Exit',
    },
    CommitteeCheck: {
      ClickBack: 'Pro Upgrade - Committee Check Page: Click back',
      ClickNext: 'Pro Upgrade - Committee Check Page: Click next',
      HoverNameHelp:
        'Pro Upgrade - Committee Check Page: Hover "Name of Campaign Committee" help',
      ToggleRequired:
        'Pro Upgrade - Committee Check Page: Toggle EIN requirement',
      HoverEinHelp:
        'Pro Upgrade - Committee Check Page: Hover "EIN number" help',
      ClickUpload: 'Pro Upgrade - Committee Check Page: Click Upload ',
      HoverUploadHelp:
        'Pro Upgrade - Committee Check Page: Hover "Upload" help',
    },
    ServiceAgreement: {
      ClickBack: 'Pro Upgrade - Service Agreement Page: Click back',
      ClickFinish: 'Pro Upgrade - Service Agreement Page: Click finish',
    },
    ClickGoToStripe: 'Pro Upgrade: Click Go to Stripe',
  },
  Contacts: {
    Download: 'Contacts - Download',
    SegmentCreated: 'Contacts - Segment Created',
    SegmentDeleted: 'Contacts - Segment Deleted',
    SegmentUpdated: 'Contacts - Segment Updated',
    SegmentViewed: 'Contacts - Segment Viewed',
    ColumnEdited: 'Contacts - Column Edited',
  },
  VoterData: {
    ClickNeedHelp: 'Voter Data: Click Need Help',
    NeedHelp: {
      Exit: 'Voter Data - Need Help: Exit modal',
      SelectType: 'Voter Data - Need Help: Select Voter File type',
      Submit: 'Voter Data - Need Help: Submit',
    },
    ClickCreateCustom: 'Voter Data: Click Create Custom Voter File',
    CustomFile: {
      Exit: 'Voter Data - Custom Voter File: Exit modal',
      SelectChannel: 'Voter Data - Custom Voter File: Select Channel',
      SelectPurpose: 'Voter Data - Custom Voter File: Select Purpose',
      ClickNext: 'Voter Data - Custom Voter File: Click Next',
      Audience: {
        CheckAudience:
          'Voter Data - Custom Voter File - Audience: Check Audience',
        CheckPoliticalParty:
          'Voter Data - Custom Voter File - Audience: Check Political Party',
        CheckAge: 'Voter Data - Custom Voter File - Audience: Check Age',
        CheckGender: 'Voter Data - Custom Voter File - Audience: Check Gender',
        ClickBack: 'Voter Data - Custom Voter File - Audience: Click Back',
      },
      ClickCreate: 'Voter Data - Custom Voter File: Click Create',
    },
    ClickDetail: 'Voter Data: Click Detail View',
    FileDetail: {
      ClickBack: 'Voter Data - File Detail: Click Back',
      ClickDownloadCSV: 'Voter Data - File Detail: Click Download CSV',
      ClickViewFilters: 'Voter Data - File Detail: Click View Audience Filters',
      ClickInfoIcon: 'Voter Data - File Detail: Click Custom File Info Icon',
      LearnTakeAction: {
        ClickWriteScript:
          'Voter Data - File Detail - Learn & Take Action: Click Write Script',
        ClickReadMore:
          'Voter Data - File Detail - Learn & Take Action: Click Read More',
        ClickSchedule:
          'Voter Data - File Detail - Learn & Take Action: Click Schedule',
      },
      RecommendedPartners: {
        ClickReadMore:
          'Voter Data - File Detail - Recommended Partners: Click Read More',
      },
    },
  },
  ContentBuilder: {
    ClickContinueQuestions: 'Content Builder: Click Continue Questions',
    ClickGenerate: 'Content Builder: Click Generate',
    SelectTemplate: 'Content Builder: Select Template',
    CloseAdditionalInputs: 'Content Builder: Close Additional Inputs',
    SubmitAdditionalInputs: 'Content Builder: Submit Additional Inputs',
    ClickContent: 'Content Builder: Click Content',
    Editor: {
      ClickRegenerate: 'Content Builder - Editor: Click Regenerate',
      SubmitRegenerate: 'Content Builder - Editor: Submit Regenerate',
      ClickCopy: 'Content Builder - Editor: Click Copy',
      ClickTranslate: 'Content Builder - Editor: Click Translate',
      SubmitTranslate: 'Content Builder - Editor: Submit Translate',
      OpenVersionPicker: 'Content Builder - Editor: Open Version Picker',
      SelectVersion: 'Content Builder - Editor: Select Version',
    },
    OpenKebabMenu: 'Content Builder - Editor: Open Kebab Menu',
    KebabMenu: {
      ClickRename: 'Content Builder - Editor: Click Rename',
      ClickDelete: 'Content Builder - Editor: Click Delete',
    },
  },
  Profile: {
    CampaignDetails: {
      ClickSave: 'Profile - Campaign Details: Click Save',
    },
    OfficeDetails: {
      ClickEdit: 'Profile - Office Details: Click Edit',
      ClickSave: 'Profile - Office Details: Click Save',
    },
    RunningAgainst: {
      ClickAddNew: 'Profile - Running Against: Click Add New',
      SubmitAddNew: 'Profile - Running Against: Submit Add New',
      CancelAddNew: 'Profile - Running Against: Cancel Add New',
      ClickEdit: 'Profile - Running Against: Click Edit',
      SubmitEdit: 'Profile - Running Against: Submit Edit',
      CancelEdit: 'Profile - Running Against: Cancel Edit',
      ClickDelete: 'Profile - Running Against: Click Delete',
      ClickSave: 'Profile - Running Against: Click Save',
    },
    Why: {
      ClickSave: 'Profile - Why Section: Click Save',
    },
    FunFact: {
      ClickSave: 'Profile - Fun Fact: Click Save',
    },
    TopIssues: {
      ClickFinish: 'Profile - Top Issues: Click Finish Entering Issues',
      ClickEdit: 'Profile - Top Issues: Click Edit',
      SubmitEdit: 'Profile - Top Issues: Submit Edit',
      CancelEdit: 'Profile - Top Issues: Cancel Edit',
      ClickDelete: 'Profile - Top Issues: Click Delete',
      SubmitDelete: 'Profile - Top Issues: Submit Delete',
      CancelDelete: 'Profile - Top Issues: Cancel Delete',
    },
  },
  Settings: {
    PersonalInfo: {
      ClickUpload: 'Settings - Personal Info: Click Upload',
      ClickSave: 'Settings - Personal Info: Click Save',
    },
    Account: {
      ClickUpgrade: 'Settings - Account Settings: Click Upgrade',
      ClickSendEmail: 'Settings - Account Settings: Click Send Email',
      ClickManageSubscription:
        'Settings - Account Settings: Click Manage Pro Subscription',
    },
    Notifications: {
      ToggleEmail: 'Settings - Notifications: Toggle Email',
    },
    Password: {
      ClickSave: 'Settings - Password: Click Save',
    },
    DeleteAccount: {
      ClickDelete: 'Settings - Delete Account: Click Delete',
      SubmitDelete: 'Settings - Delete Account: Submit Delete',
      CancelDelete: 'Settings - Delete Account: Cancel Delete',
    },
  },
  /**
   * ⚠️  HUBSPOT INTEGRATION WARNING - USE CAUTION WHEN EDITING EVENT NAMES ⚠️
   *
   * These event names are used by HubSpot workflows to track 10DLC compliance status.
   * Changing these names will break the Segment → HubSpot integration and cause users
   * to receive incorrect email sequences.
   *
   * If you need to change an event name:
   * 1. Update the corresponding HubSpot workflow trigger to match
   * 2. Test the full flow: App → Segment → HubSpot → Workflow triggers
   * 3. Verify the "10 DLC Compliance Status" field updates correctly
   *
   * HubSpot workflows listen for these events via the `pe21589597_segment___all_track`
   * custom event with `Name` property matching these exact strings.
   */
  Outreach: {
    P2PCompliance: {
      ComplianceStarted: 'Voter Outreach - 10DLC Compliance Started',
      // ⚠️  HUBSPOT INTEGRATION WARNING - DO NOT MODIFY - SEE ABOVE ⚠️
      // Used in: https://app.hubspot.com/workflows/21589597/platform/flow/1739292528/edit
      ComplianceFormSubmitted:
        'Voter Outreach - 10DLC Compliance Form Submitted',
      // ⚠️  HUBSPOT INTEGRATION WARNING - DO NOT MODIFY - SEE ABOVE ⚠️
      // Used in: https://app.hubspot.com/workflows/21589597/platform/flow/1739202168/edit/triggers/event
      CvPinFormSubmitted: 'Voter Outreach - 10DLC Compliance PIN Submitted',
    },
    DlcCompliance: {
      RegistrationSubmitted: '10 DLC Compliance - Registration Submitted',
      PinVerificationCompleted:
        '10 DLC Compliance - PIN Verification Completed',
    },
    PaymentStarted: 'Voter Outreach - Payment Started',
    ViewAccessed: 'Outreach - View Accessed',
    ClickCreate: 'Outreach - Click Create',
    SocialMedia: {
      Complete: 'Outreach - Social Media: Complete',
    },
    DoorKnocking: {
      Complete: 'Outreach - Door Knocking: Complete',
    },
    PhoneBanking: {
      Complete: 'Outreach - Phone Banking: Complete',
    },
    ActionClicked: 'Outreach - Action Clicked',
  },
  CandidateWebsite: {
    Started: 'Candidate Website - Started',
    Continued: 'Candidate Website - Continued',
    // ⚠️  HUBSPOT INTEGRATION WARNING - DO NOT MODIFY - SEE ABOVE ⚠️
    // Used in: https://app.hubspot.com/workflows/21589597/platform/flow/1739355978/edit
    Published: 'Candidate Website - Published',
    Unpublished: 'Candidate Website - Unpublished',
    Edited: 'Candidate Website - Edited',
    StartedDomainSelection: 'Candidate Website - Started domain selection',
    SelectedDomain: 'Candidate Website - Selected domain',
    // ⚠️  HUBSPOT INTEGRATION WARNING - DO NOT MODIFY - SEE ABOVE ⚠️
    // Used in: https://app.hubspot.com/workflows/21589597/platform/flow/1739356013/edit
    PurchasedDomain: 'Candidate Website - Purchased domain',
  },
  Candidacy: {
    DidYouWinModalViewed: 'Candidacy - Did You Win Modal Viewed',
    DidYouWinModalCompleted: 'Candidacy - Did You Win Modal Completed',
    CampaignCompleted: 'Candidacy - Campaign Completed',
  },
} as const

interface UserCookie {
  email?: string
  metaData?: {
    hubspotId?: string
  }
}

export const getStoredSessionId = (): number => {
  return Number(cookie.get('analytics_session_id') ?? 0)
}

export const storeSessionId = (id: number): void => {
  cookie.set('analytics_session_id', String(id))
}

export const extractClids = (
  searchParams: URLSearchParams,
): Record<string, string> => {
  const clids: Record<string, string> = {}

  for (const [key, value] of searchParams.entries()) {
    if (key.toLowerCase().endsWith('clid')) {
      clids[key] = value
    }
  }
  return clids
}

interface TrackRegistrationParams {
  analytics: Promise<Analytics | null>
  userId: string
  email?: string
  signUpMethod?: string
}

export const trackRegistrationCompleted = async ({
  analytics,
  userId,
  email,
  signUpMethod = 'email',
}: TrackRegistrationParams): Promise<void> => {
  const signUpDate = new Date().toISOString()

  try {
    const analyticsInstance = await analytics
    if (analyticsInstance && typeof analyticsInstance.identify === 'function') {
      if (typeof analyticsInstance.ready === 'function') {
        await analyticsInstance.ready()
      }
      analyticsInstance.identify(userId, {
        signUpDate,
        signUpMethod,
        ...(email ? { email } : {}),
      })
    }
  } catch (error) {
    console.error('Error identifying user for registration:', error)
  }

  trackEvent(EVENTS.Onboarding.RegistrationCompleted, {
    signUpDate,
    signUpMethod,
  })
}

export const persistUtmsOnce = (): void => {
  if (typeof window === 'undefined' || !window.location.search) return

  const params = new URLSearchParams(window.location.search)

  for (const key of UTM_KEYS) {
    const value = params.get(key)
    if (!value) continue

    const firstKey = `${key}_first`
    const lastKey = `${key}_last`

    if (!sessionStorage.getItem(firstKey)) {
      sessionStorage.setItem(firstKey, value)
    }

    sessionStorage.setItem(lastKey, value)
  }
}

export const persistClidsOnce = (): void => {
  if (typeof window === 'undefined' || !window.location.search) return

  const params = new URLSearchParams(window.location.search)

  for (const [key, value] of params.entries()) {
    if (!key.toLowerCase().endsWith(CLID_SUFFIX) || !value) continue

    const firstKey = `${key}_first`
    const lastKey = `${key}_last`

    if (!sessionStorage.getItem(firstKey)) {
      sessionStorage.setItem(firstKey, value)
    }
    sessionStorage.setItem(lastKey, value)
  }
}

export const getPersistedUtms = (): Record<string, string> => {
  if (
    typeof window === 'undefined' ||
    typeof window.sessionStorage === 'undefined'
  ) {
    return {}
  }

  const utms: Record<string, string> = {}

  try {
    for (const key of UTM_KEYS) {
      const first = window.sessionStorage.getItem(`${key}_first`)
      const last = window.sessionStorage.getItem(`${key}_last`)

      if (first) utms[`${key}_first`] = first
      if (last) utms[`${key}_last`] = last
    }
  } catch (_e) {
    return {}
  }

  return utms
}

export const getPersistedClids = (): Record<string, string | null> => {
  if (
    typeof window === 'undefined' ||
    typeof window.sessionStorage === 'undefined'
  ) {
    return {}
  }

  const clids: Record<string, string | null> = {}

  try {
    for (let i = 0; i < window.sessionStorage.length; i++) {
      const key = window.sessionStorage.key(i)
      if (
        key &&
        (key.toLowerCase().endsWith(`${CLID_SUFFIX}_first`) ||
          key.toLowerCase().endsWith(`${CLID_SUFFIX}_last`))
      ) {
        clids[key] = window.sessionStorage.getItem(key)
      }
    }
  } catch (_e) {
    return {}
  }
  return clids
}

const getUserProperties = (): Record<string, string> => {
  const userCookie = getUserCookie(true) as UserCookie | false
  if (!userCookie) {
    return {}
  }

  const properties: Record<string, string | undefined> = {
    email: userCookie.email,
    hubspotId: userCookie.metaData?.hubspotId,
  }

  return Object.entries(properties).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      acc[key] = value
    }
    return acc
  }, {} as Record<string, string>)
}

export const trackEvent = (
  name: string,
  properties?: Record<
    string,
    string[] | string | number | boolean | object | null | undefined
  >,
): void => {
  try {
    const commonProperties = {
      ...getPersistedUtms(),
      ...getUserProperties(),
      ...properties,
    }
    segmentTrackEvent(name, commonProperties)
  } catch (e) {
    console.log('error tracking analytics (Segment) event', e)
  }
}

type PropertyValue = string | boolean | number | Date

export const buildTrackingAttrs = (
  name: string,
  properties?: Record<string, PropertyValue>,
): Record<string, string> => {
  if (!properties) {
    return {
      'data-fs-element': name,
    }
  }

  const attributes: Record<string, string | number | boolean> = {}
  const propSchema: Record<string, string> = {}

  Object.entries(properties).forEach(([key, initialValue]) => {
    const prefixedKey = `data-${kebabCase(key)}`
    let value: string | number | boolean = initialValue as
      | string
      | number
      | boolean
    let propType: string

    switch (typeof initialValue) {
      case 'string':
        propType = 'str'
        break
      case 'boolean':
        propType = 'bool'
        break
      case 'number':
        propType = Number.isInteger(value) ? 'int' : 'real'
        break
      case 'object':
        if (initialValue instanceof Date) {
          propType = 'date'
          value = initialValue.toISOString()
          break
        }
        return
      default:
        return
    }

    attributes[prefixedKey] = value
    propSchema[prefixedKey] = propType
  })

  return {
    'data-fs-element': name,
    'data-fs-properties-schema': JSON.stringify(propSchema),
    ...attributes,
  } as Record<string, string>
}
