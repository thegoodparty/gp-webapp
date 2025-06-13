'use client'
import { useState } from 'react'
import Image from 'next/image'
import Checkbox from '@shared/inputs/Checkbox'
import H1 from '@shared/typography/H1'
import Button from '@shared/buttons/Button'
import PlaceholderImage from './PlaceholderImage'
import H2 from '@shared/typography/H2'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import TextField from '@shared/inputs/TextField'
import EmailInput from '@shared/inputs/EmailInput'
import PhoneInput from '@shared/inputs/PhoneInput'

function submitContactForm(formData) {
  return clientFetch(apiRoutes.website.contactForm, formData)
}

export const WEBSITE_THEMES = {
  light: {
    bg: 'bg-white',
    text: 'text-gray-800',
    accent: 'bg-campaign-blue-500',
    accentText: 'text-white',
    secondary: 'bg-gray-100',
    border: 'border-gray-200',
  },
  dark: {
    bg: 'bg-gray-900',
    text: 'text-white',
    accent: 'bg-white',
    accentText: 'text-gray-900',
    secondary: 'bg-gray-800',
    border: 'border-gray-700',
  },
  vibrant: {
    bg: 'bg-indigo-50',
    text: 'text-indigo-900',
    accent: 'bg-indigo-600',
    accentText: 'text-white',
    secondary: 'bg-pink-100',
    border: 'border-indigo-200',
  },
  earthy: {
    bg: 'bg-amber-50',
    text: 'text-amber-900',
    accent: 'bg-amber-600',
    accentText: 'text-white',
    secondary: 'bg-amber-100',
    border: 'border-amber-200',
  },
  professional: {
    bg: 'bg-slate-50',
    text: 'text-slate-900',
    accent: 'bg-slate-700',
    accentText: 'text-white',
    secondary: 'bg-slate-200',
    border: 'border-slate-300',
  },
  energetic: {
    bg: 'bg-orange-50',
    text: 'text-orange-900',
    accent: 'bg-orange-500',
    accentText: 'text-white',
    secondary: 'bg-orange-100',
    border: 'border-orange-200',
  },
}

// From gp-api
// interface WebsiteContent {
//     logo: string
//     theme: string
//     main: {
//       title: string
//       tagline: string
//       image: string
//     }
//     about: {
//       bio: string
//       issues: Array<{
//         title: string
//         description: string
//       }>
//     }
//     contact: {
//       address: string
//       email: string
//       phone: string
//     }
//   }
// }

export default function WebsiteContent({ website }) {
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false)
  const [formData, setFormData] = useState({
    smsConsent: false,
  })
  const content = website?.content || {}
  const candidateName = content?.campaignName || ''
  const activeTheme = WEBSITE_THEMES[content?.theme] || WEBSITE_THEMES.light
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  function handleSubmit(e) {
    e.preventDefault()
    submitContactForm(formData)
  }

  function handleChange(name, value) {
    setFormData((current) => {
      const newFormData = { ...current, [name]: value }
      return newFormData
    })
  }

  return (
    <div className={`${activeTheme.bg} ${activeTheme.text}`}>
      <header
        className={`p-4 border-b ${activeTheme.border} ${activeTheme.bg}`}
      >
        <nav className="px-8 flex justify-between items-center">
          <Image
            src={content?.logo || '/images/logo/heart.svg'}
            alt="Campaign Logo"
            height={32}
            width={200}
            className="h-8 max-w-[200px] object-contain object-left"
          />
          <ul className="flex space-x-6 list-none">
            <li>
              <a href="#about" className="hover:opacity-80">
                About
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:opacity-80">
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <section className={`py-16 px-4 ${activeTheme.secondary}`}>
        <div className="px-8 flex-col md:flex-row flex gap-8 justify-between items-stretch md:items-center">
          <div>
            <H1 className="mb-4">{content?.main?.title || ''}</H1>
            <p className="text-2xl mb-6">{content?.main?.tagline || ''}</p>
            <Button
              href="#contact"
              className={`inline-block !${activeTheme.accent} !${activeTheme.accentText}`}
            >
              Send a Message
            </Button>
          </div>
          {content?.main?.image ? (
            <div className="w-full max-w-md h-80 rounded-lg shadow-lg overflow-hidden">
              <Image
                src={content?.main?.image}
                alt="Campaign Hero"
                className="w-full h-full object-cover"
                height={320}
                width={640}
              />
            </div>
          ) : (
            <PlaceholderImage theme={activeTheme} />
          )}
        </div>
      </section>

      <section
        id="about"
        className={`mx-auto max-w-3xl py-10 px-4 ${activeTheme.bg} scroll-mt-16`}
      >
        <H2 className="mb-4">About</H2>
        <p className="mb-6">{content?.about?.bio || ''}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {content?.about?.issues?.map((issue, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${activeTheme.secondary} text-center`}
            >
              <h3 className="font-medium">{issue.title}</h3>
              <p className="text-sm mt-1">{issue.description}</p>
            </div>
          ))}

          {(!content?.about?.issues || content?.about?.issues?.length === 0) &&
            Array(4)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${activeTheme.secondary} text-center`}
                >
                  <h3 className="font-medium">Add Policy Issues</h3>
                  <p className="text-sm mt-1">in the editor</p>
                </div>
              ))}
        </div>
      </section>

      <section
        id="contact"
        className={`mx-auto max-w-3xl py-10 px-4 ${activeTheme.bg} scroll-mt-16`}
      >
        <H2 className="mb-4">Send a Message</H2>
        <p className="mb-6">
          Have questions or suggestions? We&apos;d love to hear from you!
        </p>

        <form
          className={`p-6 rounded-lg ${activeTheme.secondary} shadow-sm space-y-4`}
          onSubmit={handleSubmit}
        >
          <TextField
            label="Your Name"
            name="name"
            fullWidth
            required
            placeholder="John Doe"
            onChange={(e) => handleChange('name', e.target.value)}
            inputProps={{
              style: { color: 'inherit' },
            }}
            InputLabelProps={{
              shrink: true,
              style: { color: 'inherit' },
            }}
          />
          <EmailInput
            required
            placeholder="john@example.com"
            onChangeCallback={(e) => handleChange('email', e.target.value)}
            inputProps={{
              style: { color: 'inherit' },
            }}
            InputLabelProps={{
              shrink: true,
              style: { color: 'inherit' },
            }}
          />
          <PhoneInput
            required
            shrink
            onChangeCallback={(phone) => handleChange('phone', phone)}
            inputProps={{
              style: { color: 'inherit' },
            }}
            InputLabelProps={{
              shrink: true,
              style: { color: 'inherit' },
            }}
          />
          <TextField
            label="Message"
            name="message"
            fullWidth
            required
            multiline
            rows={4}
            placeholder="How can we help you?"
            onChange={(e) => handleChange('message', e.target.value)}
            inputProps={{
              style: { color: 'inherit' },
            }}
            InputLabelProps={{
              shrink: true,
              style: { color: 'inherit' },
            }}
          />
          <div className="flex items-start space-x-2">
            <Checkbox
              onChange={(e) =>
                handleChange('smsConsent', e.target.checked === true)
              }
            />
            <label htmlFor="sms-consent" className="text-xs">
              By providing your number, you consent to receive campaign texts
              (msg freq varies, msg/data rates apply). Your data will not be
              shared with third parties for marketing. Reply STOP to opt out,
              HELP for help. See our{' '}
              <button
                type="button"
                className="text-campaign-blue-500 underline hover:text-campaign-blue-700"
                onClick={(e) => {
                  e.preventDefault()
                  setShowPrivacyPolicy(true)
                }}
              >
                Privacy Policy
              </button>{' '}
              for details.
            </label>
          </div>
          <Button
            type="submit"
            className={`!${activeTheme.accent} !${activeTheme.accentText}`}
          >
            Send Message
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="font-medium">Campaign Headquarters</p>
          <p className="mt-1">{content?.contact?.address || ''}</p>
          <p className="mt-1">{content?.contact?.email || ''}</p>
          <p className="mt-1">{content?.contact?.phone || ''}</p>
        </div>
      </section>

      <footer className={`py-6 px-4 border-t ${activeTheme.border}`}>
        <div className="container mx-auto text-center">
          <p className="text-sm mb-4">
            &copy; {new Date().getFullYear()} • All Rights Reserved •{' '}
            {
              <button
                type="button"
                className="text-sm hover:underline"
                onClick={() => setShowPrivacyPolicy(true)}
              >
                Privacy Policy
              </button>
            }
          </p>

          <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-2 pt-2 ">
            <span>Empowered by</span>
            <svg
              width="21"
              height="17"
              viewBox="0 0 21 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.5 16.0943C14.7127 14.0566 17.5108 11.7713 18.9364 9.42378C20.1435 7.43596 20.2938 5.49775 19.5359 3.90325C18.8477 2.45547 17.4495 1.42171 15.8389 1.15535C14.1199 0.871043 12.3704 1.47864 10.9834 2.98335L10.5 3.50781L10.0166 2.98335C8.6296 1.47864 6.88015 0.871043 5.16108 1.15535C3.55052 1.42171 2.15231 2.45547 1.4641 3.90325C0.706157 5.49775 0.85648 7.43596 2.06363 9.42378C3.48922 11.7713 6.28734 14.0566 10.5 16.0943Z"
                fill="white"
                stroke="#BF0020"
                strokeWidth="1.55798"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10.0712 10.3672L8.92515 10.9561C8.80802 11.0163 8.66314 10.9723 8.60153 10.8579C8.577 10.8123 8.56853 10.7601 8.57744 10.7094L8.79643 9.46149C8.84767 9.16949 8.7486 8.87154 8.53149 8.66471L7.60382 7.78094C7.50908 7.69068 7.50717 7.54246 7.59956 7.4499C7.63633 7.41305 7.68451 7.38907 7.73664 7.38167L9.01827 7.19966C9.31848 7.15702 9.57798 6.97278 9.7122 6.70699L10.2853 5.57199C10.3439 5.45604 10.4876 5.40841 10.6062 5.46562C10.6535 5.48841 10.6918 5.52579 10.7151 5.57199L11.2883 6.70699C11.4225 6.97278 11.682 7.15702 11.9822 7.19966L13.2638 7.38167C13.3948 7.40027 13.4855 7.51906 13.4665 7.64701C13.4589 7.69794 13.4343 7.74501 13.3966 7.78094L12.469 8.66471C12.2519 8.87154 12.1528 9.16949 12.204 9.46149L12.423 10.7094C12.4454 10.8368 12.3578 10.9578 12.2273 10.9797C12.1754 10.9884 12.122 10.9801 12.0753 10.9561L10.9292 10.3672C10.6607 10.2292 10.3398 10.2292 10.0712 10.3672Z"
                fill="#0027DC"
              />
            </svg>
            <a
              href="https://goodparty.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              GoodParty.org
            </a>
          </div>
        </div>
      </footer>

      {showPrivacyPolicy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
              onClick={() => setShowPrivacyPolicy(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <div>
              <h2 className="text-xl font-bold mb-1">
                SMS Privacy Policy for {content?.main?.title || ''}
              </h2>
              <div className="text-sm text-gray-500 mb-4">
                Last Updated: {currentDate}
              </div>
              <div className="space-y-4 text-sm">
                <div>
                  <h3 className="font-medium">
                    SMS Communications & Data Collection
                  </h3>
                  <p>
                    By providing your mobile phone number to the {candidateName}{' '}
                    campaign, you consent to receive recurring SMS messages from
                    us. Message frequency may vary. We collect your mobile
                    number, opt-in information, and messaging interactions to
                    provide you with campaign updates, volunteer opportunities,
                    event notifications, and other campaign-related
                    communications.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Data Protection Commitment</h3>
                  <p>
                    We will not share mobile contact information with third
                    parties or affiliates for marketing/promotional purposes.
                    All SMS opt-in data and consent information will not be
                    shared with any third parties. We take your privacy
                    seriously and implement reasonable security measures to
                    protect your information.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Your Rights</h3>
                  <p>
                    You have the right to access, correct, and delete your
                    personal information. You can exercise these rights by
                    contacting us at {content?.contact?.email || ''}.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Opt-Out Instructions</h3>
                  <p>
                    You can opt out of receiving text messages at any time by
                    replying STOP to any message. After you send the message
                    STOP to us, we will send you a reply message to confirm that
                    you have been unsubscribed. After this, you will no longer
                    receive SMS messages from us.
                  </p>
                  <p>
                    If you need assistance with text messaging, reply with HELP
                    or contact us at {content?.contact?.phone || ''} or{' '}
                    {content?.contact?.email || ''}.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Policy Updates</h3>
                  <p>
                    We may update this privacy policy from time to time. We will
                    notify you of any changes by posting the new policy on this
                    page and, where appropriate, via SMS message.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Contact Information</h3>
                  <p>
                    If you have any questions about our privacy practices or
                    this policy, please contact us at:
                  </p>
                  <p className="mt-2">Email: {content?.contact?.email || ''}</p>
                  <p>Phone: {content?.contact?.phone || ''}</p>
                  <p>Address: {content?.contact?.address || ''}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
