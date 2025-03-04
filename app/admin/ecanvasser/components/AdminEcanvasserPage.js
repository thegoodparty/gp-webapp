'use client';
import Button from '@shared/buttons/Button';
import PortalPanel from '@shared/layouts/PortalPanel';
import Body1 from '@shared/typography/Body1';
import H1 from '@shared/typography/H1';
import AdminWrapper from 'app/admin/shared/AdminWrapper';
import { clientFetch } from 'gpApi/clientFetch';
import { apiRoutes } from 'gpApi/routes';
import { useState, useEffect } from 'react';
import AddEcanvasser from './AddEcanvasser';
import EcanvasserList from './EcanvasserList';

const fetchAllEcanvasser = async () => {
  try {
    const resp = await clientFetch(apiRoutes.ecanvasser.list);
    return resp.data;
  } catch (e) {
    console.log('error fetchAllEvanvasser', e);
    return [];
  }
};

export default function AdminEcanvasserPage() {
  const [ecanvassers, setEcanvassers] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    loadAllEcanvassers();
  }, []);

  const loadAllEcanvassers = async () => {
    const all = await fetchAllEcanvasser();
    setEcanvassers(all);
  };

  const afterCreate = async () => {
    await loadAllEcanvassers();
    setOpenModal(false);
  };

  const afterUpdate = async () => {
    await loadAllEcanvassers();
  };

  return (
    <AdminWrapper>
      <PortalPanel color="#70EDF8">
        <div className="flex justify-between">
          <div>
            <H1>Ecanvasser</H1>
            <Body1>
              You need to create an API key in ecanvasser for each leader and
              add it to a campaign here.
            </Body1>
          </div>
          <Button
            color="primary"
            size="medium"
            onClick={() => setOpenModal(true)}
          >
            Add an API key
          </Button>
        </div>
        <EcanvasserList ecanvassers={ecanvassers} onUpdate={afterUpdate} />
      </PortalPanel>
      <AddEcanvasser
        open={openModal}
        onClose={() => setOpenModal(false)}
        createCallback={afterCreate}
      />
    </AdminWrapper>
  );
}
