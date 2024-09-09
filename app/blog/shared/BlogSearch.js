'use client';

import { Autocomplete, TextField, InputAdornment } from '@mui/material';
import { SearchRounded } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { fireGTMButtonClickEvent } from '@shared/buttons/fireGTMButtonClickEvent';
import styles from './BlogSearch.module.scss';

/**
 * @typedef {Object} BlogSearchProps
 * @property {Object[]} blogItems Array of blog article objects with title and slug properties
 */

/**
 * Autocomplete search component for blog articles
 * @param {BlogSearchProps} props
 */

export default function BlogSearch({ blogItems }) {
  const router = useRouter();

  if (!blogItems || blogItems.length <= 0) return null;

  return (
    <div className="w-full md:w-[715px] lg:w-auto">
      <Autocomplete
        className={`${styles.wrapper}`}
        options={blogItems}
        getOptionLabel={(option) => option.title}
        fullWidth
        renderInput={(params) => (
          <TextField
            ref={params.InputProps.ref}
            {...params}
            placeholder="Search all blog articles"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRounded className="ml-3" />
                </InputAdornment>
              ),
            }}
          />
        )}
        onChange={(event, item) => {
          fireGTMButtonClickEvent({
            id: 'blog-search',
          });
          if (item != undefined && item != '') {
            router.push('/blog/article/' + item.slug);
          }
        }}
      />
    </div>
  );
}
