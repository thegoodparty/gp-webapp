import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'

interface RevalidateResponse {
  success: boolean
}

export const revalidatePage = async (path: string): Promise<RevalidateResponse> => {
  const resp = await clientFetch<RevalidateResponse>(apiRoutes.admin.bustCache, { path })
  return resp.data
}

export const revalidateCandidates = async (): Promise<void> => {
  // const path = '/candidate/[slug]';
  // await revalidatePage(path);
  // const editPath = '/candidate/[slug]/edit';
  // return await revalidatePage(editPath);
}

