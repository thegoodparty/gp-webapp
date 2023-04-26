import { useState, useEffect } from 'react';
import { fetchCampaignVersions } from './ajaxActions';

export default function useVersions() {
  const [versions, setVersions] = useState({});

  useEffect(() => {
    loadVersions();
  }, []);

  const loadVersions = async () => {
    const res = await fetchCampaignVersions();
    setVersions(res.versions);
  };

  return versions;
}
