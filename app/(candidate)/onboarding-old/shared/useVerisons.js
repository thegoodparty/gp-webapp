import { useState, useEffect } from 'react';
import { fetchCampaignVersions } from '../../onboarding/shared/ajaxActions';

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
