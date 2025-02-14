import { useState, useEffect } from 'react';
import { fetchCampaignVersions } from '../../onboarding/shared/ajaxActions';

export default function useVersions() {
  const [versions, setVersions] = useState({});

  useEffect(() => {
    loadVersions();
  }, []);

  const loadVersions = async () => {
    const versions = await fetchCampaignVersions();
    setVersions(versions);
  };

  return versions;
}
