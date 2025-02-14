import { clientFetch } from 'gpApi/clientFetch';
import { apiRoutes } from 'gpApi/routes';

const saveToken = async (token) => {
  const resp = await clientFetch(apiRoutes.setCookie, { token });
  return resp.data;
};

export default saveToken;
