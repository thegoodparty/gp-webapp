'use client';
import { createContext, useState, useEffect } from 'react';
import { clientFetch } from 'gpApi/clientFetch';
import { apiRoutes } from 'gpApi/routes';

export const EcanvasserContext = createContext([null, () => {}]);

export function EcanvasserProvider({ children }) {
  const [ecanvasser, setEcanvasser] = useState(null);

  useEffect(() => {
    const fetchEcanvasser = async () => {
      try {
        const ecanvasser = await clientFetch(apiRoutes.ecanvasser.mine, null, {
          revalidate: 100,
        });
        setEcanvasser(ecanvasser?.status === 404 ? null : ecanvasser);
      } catch (e) {
        console.log('error fetching ecanvasser', e);
        setEcanvasser(null);
      }
    };
    fetchEcanvasser();
  }, []);

  return (
    <EcanvasserContext.Provider value={[ecanvasser, setEcanvasser]}>
      {children}
    </EcanvasserContext.Provider>
  );
}
