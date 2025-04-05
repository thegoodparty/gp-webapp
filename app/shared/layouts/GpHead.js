import React from 'react'
import { APP_BASE } from 'appEnv'

function GpHead({ title, description, image, slug = '/' }) {
  const canonical = APP_BASE + slug
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
          content="https://assets.goodparty.org/gp-share.png"
        />
      )}
      <link
        rel="icon"
        type="image/png"
        href="https://assets.goodparty.org/favicon.png"
      />
      <link rel="canonical" href={canonical} />
    </>
  )
}

export default GpHead
