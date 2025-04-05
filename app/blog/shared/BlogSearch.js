'use client'

import { Autocomplete, TextField, InputAdornment } from '@mui/material'
import { SearchRounded } from '@mui/icons-material'
import { useRouter } from 'next/navigation'
import { fireGTMButtonClickEvent } from '@shared/buttons/fireGTMButtonClickEvent'

/**
 * @typedef {Object} BlogSearchProps
 * @property {Object[]} blogItems Array of blog article objects with title and slug properties
 */

/**
 * Autocomplete search component for blog articles
 * @param {BlogSearchProps} props
 */

export default function BlogSearch({ blogItems }) {
  const router = useRouter()

  if (!blogItems || blogItems.length <= 0) return null

  return (
    <div className="w-full md:w-[715px] lg:w-auto mt-2 lg:mt-0">
      <Autocomplete
        options={blogItems}
        getOptionLabel={(option) => option.title}
        disablePortal
        fullWidth
        sx={{
          '& + .MuiAutocomplete-popper .MuiAutocomplete-option': {
            fontFamily: 'var(--sfpro-font)',
            '&.Mui-focused, &.Mui-hover': {
              backgroundColor: '#EEF3F6',
            },
            '&.Mui-focusVisible': {
              backgroundColor: '#E0E6EC',
            },
          },
        }}
        renderInput={(params) => (
          <TextField
            sx={{
              '& .MuiInputBase-formControl': {
                borderRadius: '8px !important',
                fontFamily: 'inherit',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                bottom: '5px',
              },
            }}
            ref={params.InputProps.ref}
            {...params}
            placeholder="Search all blog articles"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRounded />
                </InputAdornment>
              ),
            }}
          />
        )}
        onChange={(event, item) => {
          fireGTMButtonClickEvent({
            id: 'blog-search',
          })
          if (item != undefined && item != '') {
            router.push('/blog/article/' + item.slug)
          }
        }}
      />
    </div>
  )
}
