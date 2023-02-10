'use client';

import { termLinkByTitle } from './TermSnippet';
import { Autocomplete, TextField, InputAdornment } from '@mui/material';
import { FaSearch } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function TermsSearch(props) {
  const { glossaryItems } = props;
  const router = useRouter();

  return (
    <>
      {glossaryItems && glossaryItems.length > 0 ? (
        <div className="grid grid-cols-3 gap-3 lg:grid-cols-4 items-center mt-4">
          <div className="col-span-2 lg:col-span-1">
            <Autocomplete
              sx={{ '& fieldset': { borderRadius: 33 } }}
              options={glossaryItems}
              getOptionLabel={(option) => (option ? option : '')}
              fullWidth
              // value={value}
              variant="outlined"
              renderInput={(renderInputParams) => (
                <div
                  ref={renderInputParams.InputProps.ref}
                  style={{
                    alignItems: 'center',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                  }}
                >
                  <TextField
                    style={{ flex: 1 }}
                    //   {...params}
                    InputProps={{
                      ...renderInputParams.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <FaSearch />
                        </InputAdornment>
                      ),
                    }}
                    placeholder="Search"
                    inputProps={{
                      ...renderInputParams.inputProps,
                    }}
                    InputLabelProps={{ style: { display: 'none' } }}
                  />
                </div>
              )}
              onChange={(event, item) => {
                if (item != undefined && item != '') {
                  router.push(termLinkByTitle(item));
                }
              }}
            />
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
