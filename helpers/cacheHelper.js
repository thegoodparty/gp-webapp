export const revalidatePage = async (path) => {
  const params = new URLSearchParams({ path });
  const resp = await fetch(`/api/revalidate?${params.toString()}`, {
    method: 'GET',
  });
  return resp.json();
};

export const revalidateCandidates = async () => {
  // const path = '/candidate/[slug]';
  // await revalidatePage(path);
  // const editPath = '/candidate/[slug]/edit';
  // return await revalidatePage(editPath);
};
