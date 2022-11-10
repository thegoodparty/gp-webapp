export default function Head({ params }) {
  const appBase = process.env.APP_BASE;
  const slug = params.slug || '/';
  const canonical = appBase + slug;
  return (
    <>
      <title>
        GOOD PARTY | Free tools to change the rules and disrupt the corrupt.
      </title>
      <meta
        property="og:title"
        content="GOOD PARTY | Free tools to change the rules and disrupt the corrupt."
      />
      <meta
        name="description"
        data-cy="page-description"
        content="Not a political party, we’re building tools to change the rules, empowering creatives to mobilize community & disrupt the corrupt two-party system. Join us!"
      />
      <meta
        name="og:description"
        content="Not a political party, we’re building tools to change the rules, empowering creatives to mobilize community & disrupt the corrupt two-party system. Join us!"
      />
      <meta
        property="og:image"
        content="https://assets.goodparty.org/share.jpg"
      />
      <link
        rel="icon"
        type="image/png"
        href="https://assets.goodparty.org/favicon.png"
      />
      <link rel="canonical" href={canonical} />
    </>
  );
}
