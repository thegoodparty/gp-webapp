import React from 'react';

function GpHead({ title, description, image, slug = '/' }) {
  const appBase = process.env.NEXT_PUBLIC_APP_BASE;
  const canonical = appBase + slug;
  return (
    <>
      <title>{title}</title>
      <meta property="og:title" content={title} />
      <meta
        name="description"
        data-cy="page-description"
        content={description}
      />
      <meta name="og:description" content={description} />
      {image ? (
        <meta property="og:image" content={image} />
      ) : (
        <meta
          property="og:image"
          content="https://assets.goodparty.org/gp-share.jpg"
        />
      )}
      <link
        rel="icon"
        type="image/png"
        href="https://assets.goodparty.org/favicon.png"
      />
      <link rel="canonical" href={canonical} />
    </>
  );
}

export default GpHead;
