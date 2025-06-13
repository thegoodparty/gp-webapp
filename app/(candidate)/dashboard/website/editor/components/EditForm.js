'use client'

import TextField from '@shared/inputs/TextField'
import H2 from '@shared/typography/H2'
import { Select } from '@mui/material'
import { WEBSITE_THEMES } from './WebsiteContent'
import Paper from '@shared/utils/Paper'
import FileDropZone from '@shared/inputs/FileDropZone'
import ImageCropPreview from '@shared/inputs/ImageCropPreview'
import { useState } from 'react'
import IssuesForm from './IssuesForm'
import AddressAutocomplete from './AddressAutocomplete'
import Script from 'next/script'
import EmailInput from '@shared/inputs/EmailInput'
import PhoneInput from '@shared/inputs/PhoneInput'
import Button from '@shared/buttons/Button'

const THEME_OPTIONS = Object.keys(WEBSITE_THEMES)
const MAPS_API_KEY = 'AIzaSyDMcCbNUtBDnVRnoLClNHQ8hVDILY52ez8'

export default function EditForm({ content, onChange, onSave, saveLoading }) {
  const [logoFile, setLogoFile] = useState(null)
  const [heroFile, setHeroFile] = useState(null)
  const [mapsLoaded, setMapsLoaded] = useState(false)

  const handleFieldChange = (path, value) => {
    const newContent = { ...content }

    if (typeof path === 'string') {
      // For top-level fields like theme
      newContent[path] = value
    } else {
      // For nested fields like [section, field]
      const [section, field] = path
      newContent[section] = {
        ...newContent[section],
        [field]: value,
      }
    }

    onChange(newContent)
  }

  const handleSave = (e) => {
    e.preventDefault()
    onSave(content)
  }

  const handleImageUpload = (path, file) => {
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      handleFieldChange(path, reader.result)
    }
    reader.readAsDataURL(file)

    // Update the file state based on which image is being uploaded
    if (path === 'logo') {
      setLogoFile(file)
    } else if (
      Array.isArray(path) &&
      path[0] === 'main' &&
      path[1] === 'image'
    ) {
      setHeroFile(file)
    }
  }

  const handleClearLogo = () => {
    setLogoFile(null)
    handleFieldChange('logo', '')
  }

  const handleClearHero = () => {
    setHeroFile(null)
    handleFieldChange(['main', 'image'], '')
  }

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${MAPS_API_KEY}&libraries=places`}
        onReady={() => setMapsLoaded(true)}
      />
      <Paper className="max-w-md">
        <form className="space-y-8" onSubmit={handleSave}>
          <div>
            <H2>Website Content</H2>
            <div className="space-y-4 mt-4">
              <div>
                <div className="text-sm text-gray-500 mb-2">Theme</div>
                <Select
                  native
                  value={content?.theme || ''}
                  fullWidth
                  variant="outlined"
                  onChange={(e) => handleFieldChange('theme', e.target.value)}
                >
                  {THEME_OPTIONS.map((theme) => (
                    <option key={theme} value={theme}>
                      {theme.charAt(0).toUpperCase() + theme.slice(1)}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Logo
                </label>
                {logoFile ? (
                  <ImageCropPreview
                    file={logoFile}
                    onCrop={(file) => handleImageUpload('logo', file)}
                    onClear={handleClearLogo}
                  />
                ) : (
                  <FileDropZone
                    maxSize={5000000} // 5MB
                    onChange={(file) => handleImageUpload('logo', file)}
                  />
                )}
              </div>
            </div>
          </div>

          <div>
            <H2>Main</H2>
            <div className="space-y-4 mt-4">
              <TextField
                label="Title"
                placeholder="Enter your campaign title"
                fullWidth
                required
                value={content?.main?.title || ''}
                onChange={(e) =>
                  handleFieldChange(['main', 'title'], e.target.value)
                }
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                style={{ marginBottom: '16px' }}
                label="Tagline"
                fullWidth
                required
                value={content?.main?.tagline || ''}
                onChange={(e) =>
                  handleFieldChange(['main', 'tagline'], e.target.value)
                }
                InputLabelProps={{ shrink: true }}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hero Image
                </label>
                {heroFile ? (
                  <ImageCropPreview
                    file={heroFile}
                    onCrop={(file) =>
                      handleImageUpload(['main', 'image'], file)
                    }
                    onClear={handleClearHero}
                  />
                ) : (
                  <FileDropZone
                    maxSize={5000000} // 5MB
                    onChange={(file) =>
                      handleImageUpload(['main', 'image'], file)
                    }
                  />
                )}
              </div>
            </div>
          </div>

          <div>
            <H2>About</H2>
            <div className="mt-4 space-y-4">
              <TextField
                label="Bio"
                fullWidth
                required
                multiline
                rows={4}
                value={content?.about?.bio || ''}
                onChange={(e) =>
                  handleFieldChange(['about', 'bio'], e.target.value)
                }
                InputLabelProps={{ shrink: true }}
              />

              <IssuesForm
                issues={content?.about?.issues || []}
                onChange={(issues) =>
                  handleFieldChange(['about', 'issues'], issues)
                }
              />
            </div>
          </div>

          <div>
            <H2>Contact Information</H2>
            <div className="mt-4">
              {mapsLoaded ? (
                <AddressAutocomplete
                  value={content?.contact?.address || ''}
                  onChange={(value) =>
                    handleFieldChange(['contact', 'address'], value)
                  }
                />
              ) : (
                <TextField
                  style={{ marginBottom: '16px' }}
                  label="Address"
                  fullWidth
                  value={content?.contact?.address || ''}
                  onChange={(e) =>
                    handleFieldChange(['contact', 'address'], e.target.value)
                  }
                  InputLabelProps={{ shrink: true }}
                />
              )}
              <EmailInput
                style={{ marginBottom: '16px' }}
                value={content?.contact?.email || ''}
                onChangeCallback={(e) =>
                  handleFieldChange(['contact', 'email'], e.target.value)
                }
                shrink
                className="mb-4"
              />
              <PhoneInput
                style={{ marginBottom: '16px' }}
                value={content?.contact?.phone || ''}
                onChangeCallback={(phone) =>
                  handleFieldChange(['contact', 'phone'], phone)
                }
                hideIcon
                shrink
                className="mb-4"
              />
            </div>
          </div>
          <Button loading={saveLoading} disabled={saveLoading} type="submit">
            Save
          </Button>
        </form>
      </Paper>
    </>
  )
}
