interface PageMetaDataParams {
  title: string
  description: string
  image?: string
  slug?: string
}

interface MetadataResult {
  title: string
  description: string
  alternates: {
    canonical: string
  }
  openGraph: {
    images: string
    title: string
    description: string
  }
}

const pageMetaData = ({
  title,
  description,
  image = 'https://assets.goodparty.org/gp-share-2025.png',
  slug = '/',
}: PageMetaDataParams): MetadataResult => {
  return {
    title,
    description,
    alternates: {
      canonical: slug,
    },
    openGraph: {
      images: image,
      title,
      description,
    },
  }
}

export default pageMetaData

