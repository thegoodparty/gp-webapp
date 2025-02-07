import { clientFetch } from 'gpApi/clientFetch';
import { apiRoutes } from 'gpApi/routes';

export const revalidatePage = async (path) => {
  const resp = await clientFetch(apiRoutes.admin.bustCache, { path });
  return resp.data;
};

export const revalidateCandidates = async () => {
  // const path = '/candidate/[slug]';
  // await revalidatePage(path);
  // const editPath = '/candidate/[slug]/edit';
  // return await revalidatePage(editPath);
};
