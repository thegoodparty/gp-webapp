'use client';

import MaxWidth from '@shared/layouts/MaxWidth';
import { Fragment, Suspense } from 'react';
import AdminClientLoad from './AdminClientLoad';
import LayoutWithAlphabet from './LayoutWithAlphabet';
import TermSnippet, { termLinkByTitle } from './TermSnippet';
import { Autocomplete, TextField, InputAdornment } from '@mui/material';
import { Search } from '@mui/icons-material';
import Link from 'next/link';

export default function TermsHomePage(props) {
  const { items, activeLetter, recentGlossaryItems } = props;

  let positions = [{ id: '1', name: 'KEKW' }];

  return (
    <MaxWidth>
      <div className="my-9 lg:my-16">
        <h1 className="font-black text-4xl lg:text-5xl mb-4">Terms Glossary</h1>
        <div className="text-lg">
          Good Party's Terms Glossary is a list of definitions of words from the
          political and elections world. These terms are from an independent's
          perspective with an eye toward reform. If you have a suggestion for a
          new definition, send it to{' '}
          <a href="mailto:ask@goodparty.org" rel="noopener noreferrer nofollow">
            ask@goodparty.org.
          </a>
        </div>

        <div className="grid grid-cols-3 gap-3 lg:grid-cols-4 items-center mt-4">
          <div className="col-span-2 lg:col-span-1">
            <Autocomplete
              sx={{ '& fieldset': { borderRadius: 33 } }}
              options={items}
              getOptionLabel={(option) => option.title}
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
                          {' '}
                          <Search />{' '}
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
              // onChange={(event, item) => {
              //   onChangeField('position', item?.id);
              // }}
            />
          </div>
        </div>
        {recentGlossaryItems && recentGlossaryItems.length > 0 ? (
          <>
            <div className="text-lg lg:flex pt-4">
              <h2 className="mb-1 lg:mb-0 lg:basis-1/3">
                <strong>RECENTLY ADDED TERMS</strong>
              </h2>
            </div>

            {recentGlossaryItems.map((item) => (
              <Fragment key={item}>
                <Link href={termLinkByTitle(item)}>
                  <div className="text-lg lg:flex  pt-2 mt-2">
                    <h2 className="mb-1 lg:mb-0 lg:basis-1/3 underline">
                      {item}
                    </h2>
                  </div>
                </Link>
              </Fragment>
            ))}
          </>
        ) : (
          <></>
        )}

        <LayoutWithAlphabet {...props}>
          {items && items.length > 0 ? (
            <>
              {items.map((item) => (
                <Fragment key={item.title}>
                  <TermSnippet item={item} />
                </Fragment>
              ))}
            </>
          ) : (
            <div className="text-2xl font-black">
              No items available for the letter {activeLetter}
            </div>
          )}
        </LayoutWithAlphabet>
        <Suspense>
          <AdminClientLoad />
        </Suspense>
      </div>
    </MaxWidth>
  );
}
