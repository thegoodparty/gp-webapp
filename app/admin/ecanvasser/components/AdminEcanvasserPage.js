'use client'
import Button from '@shared/buttons/Button'
import PortalPanel from '@shared/layouts/PortalPanel'
import Body1 from '@shared/typography/Body1'
import H1 from '@shared/typography/H1'
import AdminWrapper from 'app/admin/shared/AdminWrapper'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import { useState, useEffect } from 'react'
import AddEcanvasser from './AddEcanvasser'
import EcanvasserList from './EcanvasserList'

const fetchAllEcanvasser = async () => {
  try {
    const resp = await clientFetch(apiRoutes.ecanvasser.list)
    return resp.data
  } catch (e) {
    console.log('error fetchAllEvanvasser', e)
    return []
  }
}

const syncAllEcanvasser = async () => {
  try {
    const resp = await clientFetch(apiRoutes.ecanvasser.syncAll)
    return resp.data
  } catch (e) {
    console.log('error fetchAllEvanvasser', e)
    return []
  }
}

export default function AdminEcanvasserPage() {
  const [ecanvassers, setEcanvassers] = useState([])
  const [openModal, setOpenModal] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadAllEcanvassers()
  }, [])

  const loadAllEcanvassers = async () => {
    setLoading(true)
    const all = await fetchAllEcanvasser()
    setEcanvassers(all)
    setLoading(false)
  }

  const syncAll = async () => {
    setLoading(true)
    await syncAllEcanvasser()
    const all = await fetchAllEcanvasser()
    setEcanvassers(all)
    setLoading(false)
  }

  const afterCreate = async () => {
    await loadAllEcanvassers()
    setOpenModal(false)
  }

  const afterUpdate = async () => {
    await loadAllEcanvassers()
  }

  return (
    <AdminWrapper>
      <PortalPanel color="#70EDF8">
        <div className="flex justify-between">
          <div>
            <H1>Ecanvasser</H1>
            <Body1>
              You need to create an API key in ecanvasser for each leader and
              add it to a campaign here.
              <br />
              <a
                href="https://support.ecanvasser.com/en/articles/7019426-access-your-api-key"
                target="_blank"
                rel="noreferrer"
                className="text-blue-500 underline"
              >
                How to get your API key
              </a>
            </Body1>
          </div>
          <div className="">
            <Button
              color="secondary"
              onClick={syncAll}
              className="mr-4"
              disabled={loading}
            >
              Sync All
            </Button>
            <Button
              color="primary"
              onClick={() => setOpenModal(true)}
              disabled={loading}
            >
              Add an API key
            </Button>
          </div>
        </div>
        {loading ? (
          <div className="text-center mt-8 text-xl">Loading...</div>
        ) : (
          <EcanvasserList ecanvassers={ecanvassers} onUpdate={afterUpdate} />
        )}
      </PortalPanel>
      <AddEcanvasser
        open={openModal}
        onClose={() => setOpenModal(false)}
        createCallback={afterCreate}
      />
    </AdminWrapper>
  )
}
