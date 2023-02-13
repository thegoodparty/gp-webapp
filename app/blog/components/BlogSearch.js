'use client';

import { Autocomplete, TextField, InputAdornment } from '@mui/material';
import { FaSearch } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import styles from './BlogSearch.module.scss';

export default function BlogSearch(props) {
  const { blogItems } = props;
  const router = useRouter();

  return (
    <div className={styles.wrapper}>
      {blogItems && blogItems.length > 0 ? (
        <Autocomplete
          options={blogItems}
          getOptionLabel={(option) => option.title}
          fullWidth
          renderInput={(params) => (
            <TextField
              ref={params.InputProps.ref}
              {...params}
              placeholder="Search"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaSearch className="ml-3" />
                  </InputAdornment>
                ),
              }}
            />
          )}
          onChange={(event, item) => {
            if (item != undefined && item != '') {
              router.push('/blog/article/' + item.slug);
            }
          }}
        />
      ) : (
        <></>
      )}
    </div>
  );
}
