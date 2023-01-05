'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  FaTwitter,
  FaHeart,
  FaFacebookF,
  FaInstagram,
  FaRedditAlien,
  FaCommentAlt,
  FaTiktok,
} from 'react-icons/fa';

import { dateUsHelper } from 'helpers/dateHelper';

import styles from './SocialPost.module.scss';

const imgLoader = ({ src }) => src;

const SocialPost = ({ post }) => {
  const [hasImage, setHasImage] = useState(
    post && post.images && post.images.length > 0,
  );
  const [showContent, setShowContent] = useState(false);

  const hasVideo = post.video && post.video.src;

  useEffect(() => {
    let show = true;
    if (
      source === 'FACEBOOK' ||
      source === 'FACEBOOK_PUBLIC' ||
      source === 'INSTAGRAM'
    ) {
      if (hasImage) {
        show = false;
      }
    }
    if (source === 'TIKTOK' && hasVideo) {
      show = false;
    }
    setShowContent(show);
  }, [hasImage]);

  if (!post || !post.content) {
    return <></>;
  }

  const {
    title,
    userName,
    userScreenName,
    images,
    publishedAt,
    content,
    url,
    likesCount,
    source,
    commentsCount,
  } = post;

  const shortContent = content.substring(0, 140);

  let contentWithLinks = shortContent.replace(
    /\bhttps?:\/\/\S+/gi,
    '<a href="$&" target="_blank" rel="noopener noreferrer nofollow">$&</a>',
  );

  if (content.length > 140) {
    contentWithLinks += '...';
  }

  let icon = <FaTwitter />;
  if (source === 'INSTAGRAM') {
    icon = <FaInstagram />;
  } else if (source === 'TIKTOK') {
    icon = <FaTiktok />;
  } else if (source === 'REDDIT') {
    icon = <FaRedditAlien />;
  } else if (source === 'FACEBOOK' || source === 'FACEBOOK_PUBLIC') {
    icon = <FaFacebookF />;
  }

  const handleError = () => {
    setHasImage(false);
  };

  const WrapperElement = ({ children }) => {
    if (hasVideo) {
      return <div>{children}</div>;
    } else {
      return (
        <a
          className="no-underline feed-post"
          href={url}
          target="_blank"
          rel="noopener noreferrer nofollow"
          id={`feed-post-${url}`}
        >
          {children}
        </a>
      );
    }
  };

  return (
    <WrapperElement>
      <div
        className=" pt-7 px-4 pb-2 bg-white relative border border-neutral-200 rounded-xl shadow-md  break-word"
        data-cy="post-item"
      >
        <div
          className={`absolute top-6 right-4 text-2xl text-sky-400 ${styles.icon} ${source}`}
        >
          {icon}
        </div>
        <div className="pr-8">
          {title && (
            <div
              className="font-black mb-4 underline whitespace-nowrap overflow-hidden text-ellipsis"
              data-cy="post-title"
            >
              {title}
            </div>
          )}
          {(userName || userScreenName) && (
            <div>
              <div className="flex items-center mb-3">
                {userName && (
                  <div
                    className="font-black underline whitespace-nowrap"
                    data-cy="post-username"
                    style={title ? { textDecoration: 'none' } : {}}
                  >
                    {userName}
                  </div>
                )}
                {userScreenName && (
                  <div
                    className="font-black pl-3 text-neutral-300"
                    data-cy="post-screenname"
                  >
                    @{userScreenName}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        {publishedAt && (
          <div className="text-sm mb-5" data-cy="post-published-at">
            {dateUsHelper(publishedAt)}
          </div>
        )}
        {showContent && (
          <div
            className="mb-1"
            dangerouslySetInnerHTML={{ __html: contentWithLinks }}
          />
        )}

        <div className="w-full py-3 flex items-center justify-between">
          <div>
            {likesCount !== null && (
              <div className="inline-flex text-sm mr-3">
                <div>
                  <FaHeart />
                </div>
                <span
                  className="inline-block text-sm font-black ml-1"
                  data-cy="post-likes"
                >
                  {likesCount}
                </span>
              </div>
            )}

            {commentsCount !== null && (
              <div className="inline-flex text-sm mr-3">
                <div>
                  <FaCommentAlt />
                </div>
                <span
                  className="inline-block text-sm font-black ml-1"
                  data-cy="post-comments"
                >
                  {commentsCount}
                </span>
              </div>
            )}
          </div>
        </div>
        {hasImage && (
          <div className="relative" style={{ minHeight: '250px' }}>
            <Image
              src={images[0].url}
              onError={handleError}
              alt={title || `${source} social post`}
              loader={imgLoader}
              fill
              style={{
                width: '100%',
                objectFit: 'cover',
                objectPosition: 'center center',
              }}
            />
          </div>
        )}
        {hasVideo && (
          <div>
            <video
              src={post.video.src}
              poster={post.video.poster}
              controls
              preload="none"
              style={{ width: '100%', height: 'auto' }}
            />
            <br />
            <br />
            <a
              className="feed-post"
              href={url}
              target="_blank"
              rel="noopener noreferrer nofollow"
              id={`feed-post-${url}`}
              data-cy="post-view-tiktok"
            >
              View on TikTok
            </a>
          </div>
        )}
      </div>
    </WrapperElement>
  );
};

export default SocialPost;
