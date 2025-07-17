'use client'

import H3 from '@shared/typography/H3'
import {
  AccessTimeRounded,
  BoltRounded,
  SettingsRounded,
  CheckCircleRounded,
  CancelRounded,
} from '@mui/icons-material'
import DeleteDomain from './DeleteDomain'

const statusConfig = {
  pending: {
    title: 'Payment Pending',
    description: 'Awaiting payment confirmation',
    icon: AccessTimeRounded,
    theme: 'yellow',
  },
  submitted: {
    title: 'Registration in Progress',
    description: 'Domain submitted to AWS, registration in progress',
    icon: BoltRounded,
    theme: 'blue',
  },
  registered: {
    title: 'DNS Configuration Required',
    description: 'Domain registered, DNS configuration pending',
    icon: SettingsRounded,
    theme: 'orange',
  },
  active: {
    title: 'Domain Active',
    description: 'Your custom domain is live and working',
    icon: CheckCircleRounded,
    theme: 'green',
  },
  inactive: {
    title: 'Domain Inactive',
    description: 'Domain is not currently active',
    icon: CancelRounded,
    theme: 'red',
  },
}

const themeColors = {
  yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800 bg-yellow-100',
  blue: 'bg-blue-50 border-blue-200 text-blue-800 bg-blue-100',
  orange: 'bg-orange-50 border-orange-200 text-orange-800 bg-orange-100',
  green: 'bg-green-50 border-green-200 text-green-800 bg-green-100',
  red: 'bg-red-50 border-red-200 text-red-800 bg-red-100',
}

export default function CustomDomain({ domain }) {
  const config = statusConfig[domain.status] || statusConfig.inactive
  const [bg, border, text, iconBg] = themeColors[config.theme].split(' ')
  const IconComponent = config.icon

  return (
    <div className="space-y-8">
      <H3>Custom Domain</H3>
      <div className={`${bg} border ${border} rounded-lg p-4`}>
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 ${iconBg} rounded-full flex items-center justify-center`}
          >
            <IconComponent className={`w-5 h-5 ${text}`} />
          </div>
          <div>
            <p className={`text-sm ${text} font-medium`}>{config.title}</p>
            <p className="text-lg font-semibold text-gray-900">{domain.name}</p>
            <p className={`text-sm ${text} mt-1`}>{config.description}</p>
          </div>
        </div>
      </div>
      {/* {domain.status === DOMAIN_STATUS.SUBMITTED && ( */}
      <div className="flex gap-4 justify-center">
        <DeleteDomain />
      </div>
      {/* )} */}
    </div>
  )
}
