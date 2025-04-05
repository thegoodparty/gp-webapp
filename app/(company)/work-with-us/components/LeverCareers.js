'use client'
import React, { useEffect } from 'react'
import styles from './LeverCareers.module.scss'

function LeverCareers() {
  useEffect(() => {
    const handleLeverLoad = () => {
      const posts = document.querySelectorAll('.lever-job-title')
      posts.forEach((post) => {
        post.setAttribute('target', '_blank')
        post.setAttribute('rel', ' noopener noreferrer nofollow')
      })
    }
    if (!window.leverJobsOptions) {
      window.leverJobsOptions = { accountName: 'good-party', includeCss: true }
      const script = document.createElement('script')
      script.src = 'https://andreasmb.github.io/lever-jobs-embed/index.js'
      document.body.appendChild(script)

      window.addEventListener('leverJobsRendered', handleLeverLoad)
    }

    // return () => {
    //   console.log('unmount')
    //   window.removeEventListener('leverJobsRendered', handleLeverLoad);
    // };
  }, [])
  return (
    <section className={styles.wrapper}>
      <h2 data-cy="opening-title" className={styles.h2}>
        Current Openings
      </h2>
      <div id="lever-jobs-container" />
    </section>
  )
}

LeverCareers.propTypes = {}

export default LeverCareers
