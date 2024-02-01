'use client';
import Script from 'next/script';
import { useState } from 'react';
import Hero from './ElectionHero';
import Candidates from './ElectionCandidates';
import Volunteer from './ElectionVolunteer';
import ElectionDates from './ElectionDates';
import Blog from './ElectionBlog';
import dynamic from 'next/dynamic';
import ElectionCards from './ElectionCards';
const Modal = dynamic(() => import('@shared/utils/Modal'));

export default function ElectionPage(props) {
  const [showModal, setShowModal] = useState(false);

  const { city } = props;
  console.log('city1', city);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const volunteerProps = {
    handleOpenModal,
    ...props,
  };

  let blogCTA = city === 'durham' || city === 'nc' ? true : false;
  let blogDark = city === 'nashville' ? true : false;
  let blogItems = blogCTA ? 2 : 3;

  let childProps = {
    ...props,
    blogCTA,
    blogDark,
    blogItems,
  };

  return (
    <div className="bg-slate-50">
      {(city === 'durham' || city === 'nc') && <Hero {...props} />}
      <Candidates {...props} />

      {city === 'nashville' && <Volunteer {...volunteerProps} />}

      {(city === 'durham' || city === 'nc') && <ElectionCards {...props} />}

      {(city === 'durham' || city === 'nc') && <ElectionDates {...props} />}

      {showModal && (
        <Modal closeCallback={handleCloseModal} open>
          <div className="w-[90vw] md:w-[80vw] max-w-[900px] h-[70vh] md:h-[90vh]">
            <iframe
              src="https://meetings.hubspot.com/robbooth/gp-info-session"
              width="100%"
              height="100%"
            />
          </div>
        </Modal>
      )}

      <Blog {...childProps} />
    </div>
  );
}
