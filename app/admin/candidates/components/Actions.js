import { useState } from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs'
import DeleteAction from './DeleteAction'
import ImpersonateAction from 'app/admin/shared/ImpersonateAction'
import Button from '@shared/buttons/Button'

export default function Actions({ launched, slug, email, id }) {
  const [showMenu, setShowMenu] = useState(false)
  const isLive = launched === 'Live'

  return (
    <div className="flex justify-center relative">
      <BsThreeDotsVertical
        onClick={() => {
          setShowMenu(!showMenu)
        }}
        className=" text-xl cursor-pointer"
      />
      {showMenu && (
        <>
          <div
            className="fixed h-screen w-screen top-14 left-0"
            onClick={() => {
              setShowMenu(false)
            }}
          />

          <div className="absolute bg-white px-4 py-3 rounded-xl shadow-lg z-10 left-24 top-3 [&>*]:mt-2">
            <Button
              href={`/admin/campaign-details/${slug}`}
              size="small"
              className="w-full font-semibold"
              color="info"
            >
              Details
            </Button>
            <Button
              href={`/admin/victory-path/${slug}`}
              size="small"
              className="w-full font-semibold"
              color="secondary"
            >
              Path to Victory
            </Button>
            <ImpersonateAction
              email={email}
              isCandidate={true}
              launched={launched}
            />
            <DeleteAction id={id} slug={slug} isLive={isLive} />
          </div>
        </>
      )}
    </div>
  )
}
