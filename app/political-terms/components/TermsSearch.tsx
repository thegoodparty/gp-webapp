'use client'

import { termLinkByTitle } from './TermSnippet'
import { Autocomplete, TextField, InputAdornment } from '@mui/material'
import { FaSearch } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import styles from './TermsSearch.module.scss'

interface TermsSearchProps {
  glossaryItems?: string[]
}

export default function TermsSearch(props: TermsSearchProps): React.JSX.Element {
  const { glossaryItems } = props
  const router = useRouter()

  return (
    <div className={styles.wrapper}>
      {glossaryItems && glossaryItems.length > 0 ? (
        <Autocomplete
          options={glossaryItems}
          fullWidth
          renderInput={(params) => (
            <TextField
              ref={params.InputProps.ref}
              {...params}
              placeholder="Search"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaSearch className="ml-3" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          )}
          onChange={(_, item) => {
            if (item != undefined && item != '') {
              router.push(termLinkByTitle(item))
            }
          }}
        />
      ) : (
        <></>
      )}
    </div>
  )
}
