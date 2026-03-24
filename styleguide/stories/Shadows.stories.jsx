import { useState } from 'react'
import {
  PAGE_STYLE,
  PageHeader,
  STORY_PARAMS,
} from './foundations-story-helpers'

const meta = {
  title: 'Foundations/Shadows',
  parameters: {
    docs: {
      description: {
        component:
          'Shadow tokens for the design system. Includes box shadows for elevation and drop shadows for SVGs and icons. Click any sample to copy its CSS value.',
      },
    },
  },
}

export default meta

const SAMPLE_BG = '#b4cef0' // midnight-200

// =============================================================================
// Box Shadows
// =============================================================================
const BOX_SHADOWS = [
  {
    token: 'shadow-none',
    boxShadow: 'none',
  },
  {
    token: 'shadow-2xs',
    boxShadow: '0 1px 0 0 rgba(0,0,0,0.05)',
  },
  {
    token: 'shadow-xs',
    boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)',
  },
  {
    token: 'shadow-sm',
    boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)',
  },
  {
    token: 'shadow-md',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)',
  },
  {
    token: 'shadow-lg',
    boxShadow:
      '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
  },
  {
    token: 'shadow-xl',
    boxShadow:
      '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
  },
  {
    token: 'shadow-2xl',
    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
  },
]

export function BoxShadows() {
  const [copied, setCopied] = useState(null)

  function handleCopy(token, value) {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(token)
      setTimeout(() => setCopied(null), 1500)
    })
  }

  return (
    <div style={PAGE_STYLE} className="space-y-10">
      <PageHeader
        title="Box Shadows"
        description="Elevation shadows applied via box-shadow. Used to communicate depth and layer hierarchy across UI components. Click any sample to copy its CSS value."
      />

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200 text-left">
            <th className="py-3 px-4 text-sm font-bold text-gray-900 w-36">
              Token
            </th>
            <th className="py-3 px-4 text-sm font-bold text-gray-900">
              Sample
            </th>
          </tr>
        </thead>
        <tbody>
          {BOX_SHADOWS.map(({ token, boxShadow }) => {
            const isCopied = copied === token
            return (
              <tr key={token} className="border-b border-gray-200">
                <td className="py-6 px-4">
                  <code
                    className="text-sm bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded whitespace-nowrap"
                    style={{ fontFamily: 'monospace' }}
                  >
                    {token}
                  </code>
                </td>
                <td className="py-12 px-4">
                  <button
                    onClick={() => handleCopy(token, boxShadow)}
                    title="Click to copy CSS value"
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 12,
                      backgroundColor: isCopied ? '#dbeafe' : SAMPLE_BG,
                      boxShadow,
                      border: 'none',
                      cursor: 'pointer',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {isCopied && (
                      <span
                        style={{
                          fontSize: 10,
                          color: '#2563eb',
                          fontFamily: "'Open Sans', sans-serif",
                          fontWeight: 600,
                        }}
                      >
                        Copied!
                      </span>
                    )}
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

BoxShadows.storyName = 'Box Shadows'
BoxShadows.parameters = STORY_PARAMS

// =============================================================================
// Drop Shadows
// =============================================================================
const DROP_SHADOWS = [
  {
    token: 'drop-shadow-none',
    filter: 'none',
  },
  {
    token: 'drop-shadow-xs',
    filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.05))',
  },
  {
    token: 'drop-shadow-sm',
    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.15))',
  },
  {
    token: 'drop-shadow',
    filter:
      'drop-shadow(0 1px 2px rgb(0 0 0/0.1)) drop-shadow(0 1px 1px rgb(0 0 0/0.06))',
  },
  {
    token: 'drop-shadow-md',
    filter: 'drop-shadow(0 3px 3px rgba(0,0,0,0.12))',
  },
  {
    token: 'drop-shadow-lg',
    filter: 'drop-shadow(0 4px 4px rgba(0,0,0,0.15))',
  },
  {
    token: 'drop-shadow-xl',
    filter: 'drop-shadow(0 9px 7px rgba(0,0,0,0.1))',
  },
  {
    token: 'drop-shadow-2xl',
    filter: 'drop-shadow(0 25px 25px rgba(0,0,0,0.15))',
  },
]

export function DropShadows() {
  const [copied, setCopied] = useState(null)

  function handleCopy(token, value) {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(token)
      setTimeout(() => setCopied(null), 1500)
    })
  }

  return (
    <div style={PAGE_STYLE} className="space-y-10">
      <PageHeader
        title="Drop Shadows"
        description="Filter-based shadows for use on SVGs and icons. Follows the shape of the element including transparent areas. Click any sample to copy its CSS value."
      />

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200 text-left">
            <th className="py-3 px-4 text-sm font-bold text-gray-900 w-36">
              Token
            </th>
            <th className="py-3 px-4 text-sm font-bold text-gray-900">
              Sample
            </th>
          </tr>
        </thead>
        <tbody>
          {DROP_SHADOWS.map(({ token, filter }) => {
            const isCopied = copied === token
            return (
              <tr key={token} className="border-b border-gray-200">
                <td className="py-6 px-4">
                  <code
                    className="text-sm bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded whitespace-nowrap"
                    style={{ fontFamily: 'monospace' }}
                  >
                    {token}
                  </code>
                </td>
                <td className="py-12 px-4">
                  <button
                    onClick={() => handleCopy(token, filter)}
                    title="Click to copy CSS value"
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 12,
                      backgroundColor: isCopied ? '#dbeafe' : SAMPLE_BG,
                      filter: isCopied ? 'none' : filter,
                      border: 'none',
                      cursor: 'pointer',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {isCopied && (
                      <span
                        style={{
                          fontSize: 10,
                          color: '#2563eb',
                          fontFamily: "'Open Sans', sans-serif",
                          fontWeight: 600,
                        }}
                      >
                        Copied!
                      </span>
                    )}
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

DropShadows.storyName = 'Drop Shadows'
DropShadows.parameters = STORY_PARAMS
