'use client'
import React from 'react'
import LiteYouTubeEmbed from 'react-lite-youtube-embed'

import styles from './YouTubeLazyPlayer.module.scss'

export default function YouTubeLazyPlayer({
  id,
  params = {},
  height = 'auto',
}) {
  if (!id) {
    return <></>
  }

  return (
    <div className={styles.wrapper}>
      <LiteYouTubeEmbed id={id} params={params} height={height} />
    </div>
  )
}
