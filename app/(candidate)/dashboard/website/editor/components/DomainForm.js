'use client'

import TextField from '@shared/inputs/TextField'
import H2 from '@shared/typography/H2'
import Paper from '@shared/utils/Paper'
import DomainSearch from './DomainSearch'
import CustomDomain from './CustomDomain'
import { useWebsite } from '../../components/WebsiteProvider'

export default function DomainForm({ onRegisterSuccess }) {
  const { website, setWebsite } = useWebsite()
  const { vanityPath, domain } = website

  function handleVanityPathChange(value) {
    setWebsite({ ...website, vanityPath: value })
  }

  return (
    <Paper className="max-w-md">
      <div className="space-y-6">
        <H2>Domain Settings</H2>

        <TextField
          label="Vanity Path"
          placeholder="your-campaign-name"
          fullWidth
          value={vanityPath || ''}
          disabled={!!domain}
          onChange={(e) => handleVanityPathChange(e.target.value)}
          InputLabelProps={{ shrink: true }}
          helperText={`This will be used for your website URL: goodparty.org/c/${
            vanityPath || '[vanity-path]'
          }`}
        />

        {!!domain ? (
          <CustomDomain domain={domain} />
        ) : (
          <DomainSearch
            prefillSearch={vanityPath + '.com'}
            onRegisterSuccess={onRegisterSuccess}
          />
        )}
      </div>
    </Paper>
  )
}
