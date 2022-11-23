'use client';
import React, { useContext } from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import SocialPost from './SocialPost';

// import SocialPost from '../shared/SocialPost';

function CandidateFeed({ feed }) {
  let posts = [];
  if (feed && feed.results) {
    posts = feed.results;
  }
  return (
    <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 1024: 2 }}>
      <Masonry gutter="16px">
        {(posts || []).map((post) => (
          <React.Fragment key={post.url}>
            <SocialPost post={post} />
          </React.Fragment>
        ))}
      </Masonry>
    </ResponsiveMasonry>
  );
}

export default CandidateFeed;
