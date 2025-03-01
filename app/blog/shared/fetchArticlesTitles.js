import { fetchContentByType } from 'helpers/fetchHelper';

export const fetchArticlesTitles = async () =>
  await fetchContentByType('blogArticleTitles');
