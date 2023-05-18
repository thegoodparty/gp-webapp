import { revalidatePath } from 'next/cache';

export default async function revalidate(req, res) {
  const { path } = req.query;

  try {
    // This should be the actual path not a rewritten path
    // e.g. for "/blog/[slug]" this should be "/blog/post-1"
    revalidatePath(path);
    return res.json({ revalidated: true });
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).send('Error revalidating' + JSON.stringify(err));
  }
}
