'use client';

import Modal from '@shared/utils/Modal';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import contentfulHelper from 'helpers/contentfulHelper';
import { Suspense, useState } from 'react';
import CmsContentWrapper from './CmsContentWrapper';

export default function FaqModal({ children, article }) {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <div
        className="underline cursor-pointer inline"
        onClick={() => setShowModal(true)}
      >
        <span>{children}</span>
      </div>
      <Suspense>
        <Modal open={showModal} closeCallback={() => setShowModal(false)}>
          <h1 className="my-8 font-black text-3xl" data-cy="article-title">
            {article?.title}
          </h1>

          <CmsContentWrapper>
            {contentfulHelper(article.articleBody)}
          </CmsContentWrapper>
        </Modal>
      </Suspense>
    </>
  );
}
