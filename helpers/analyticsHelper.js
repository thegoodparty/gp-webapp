import { kebabCase } from 'es-toolkit'
import { segmentTrackEvent } from './segmentHelper'

export const EVENTS = {
  SignUp: {
    ClickLogin: 'Sign Up: Click Login',
  },
  SignIn: {
    ClickCreateAccount: 'Sign In: Click Create Account',
    ClickForgotPassword: 'Sign In: Click Forgot Password',
  },
  SetPassword: {
    ClickSetPassword: 'Set Password: Click Set Password',
  },
  Onboarding: {
    ClickFinishLater: 'Onboarding: Click Finish Later',
    OfficeStep: {
      ClickNext: 'Onboarding - Office Step: Click Next',
      ClickBack: 'Onboarding - Office Step: Click Back',
      OfficeSelected: 'Onboarding - Office Step: Office Selected',
      ClickCantSeeOffice: "Onboarding - Office Step: Click Can't See Office",
    },
    PartyStep: {
      ClickSubmit: 'Onboarding - Party Step: Click Submit',
    },
    PledgeStep: {
      ClickAskQuestion: 'Onboarding - Pledge Step: Click Ask a Question',
      ClickSubmit: 'Onboarding - Pledge Step: Click Submit',
    },
    CompleteStep: {
      ClickGoToDashboard: 'Onboarding - Complete Step: Click Go to Dashboard',
    },
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
      ClickTextMessaging: 'Navigation - Dashboard: Click Text Messaging',
      ClickContentBuilder: 'Navigation - Dashboard: Click Content Builder',
      ClickMyProfile: 'Navigation - Dashboard: Click My Profile',
      ClickCampaignTeam: 'Navigation - Dashboard: Click Campaign Team',
      ClickFreeResources: 'Navigation - Dashboard: Click Free Resources',
      ClickCommunity: 'Navigation - Dashboard: Click Community',
    },
  },
  Dashboard: {
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
        'Pro Upgrade - Committee Check Page: Hover “Name of Campaign Committee” help',
      ToggleRequired:
        'Pro Upgrade - Committee Check Page: Toggle EIN requirement',
      HoverEinHelp:
        'Pro Upgrade - Committee Check Page: Hover “EIN number” help',
      ClickUpload: 'Pro Upgrade - Committee Check Page: Click Upload ',
      HoverUploadHelp:
        'Pro Upgrade - Committee Check Page: Hover “Upload” help',
    },
    ServiceAgreement: {
      ClickBack: 'Pro Upgrade - Service Agreement Page: Click back',
      ClickFinish: 'Pro Upgrade - Service Agreement Page: Click finish',
    },
    ClickGoToStripe: 'Pro Upgrade: Click Go to Stripe',
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
}

export const trackEvent = (name, properties) => {
  // TODO: Repurpose this file and function for Segment when we get the green light to rip out FS
  try {
    console.debug('[TRACKING]', name, properties)
    // Segment has different environments, and should run even when FS is disabled
    segmentTrackEvent(name, properties)
    if (typeof FS === 'undefined') {
      return
    }
    FS('trackEvent', { name, properties })
  } catch (e) {
    console.log('error tracking FullStory event', e)
  }
}

/**
 * Helper function to simplify setting Fullstory tracking attributes for an Element
 * @param {string} name Unique name for this element in Fullstory
 * @param {Object.<string, string | boolean | number | Date>} properties Object defining specific Element properties
 * @returns {Object}
 * @example
 *   const trackingAttrs = buildTrackingAttrs('Some Button', {
 *     size: 23 ,
 *     owner: 'Bob',
 *     isCool: false,
 *   })
 *
 *   // spread onto element to be tracked
 *   <Button {...trackingAttrs}>Sign Up</Button>
 */
export const buildTrackingAttrs = (name, properties) => {
  if (!properties) {
    return {
      'data-fs-element': name,
    }
  }

  const attributes = {}
  const propSchema = {}

  Object.entries(properties).forEach(([key, initialValue]) => {
    const prefixedKey = `data-${kebabCase(key)}`
    let value = initialValue
    let propType

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
      default:
        // ignore property if not one of the above types
        return
    }

    attributes[prefixedKey] = value
    propSchema[prefixedKey] = propType
  })

  return {
    'data-fs-element': name,
    'data-fs-properties-schema': JSON.stringify(propSchema),
    ...attributes,
  }
}
