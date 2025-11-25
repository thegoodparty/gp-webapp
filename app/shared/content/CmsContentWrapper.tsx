import React, { ReactNode } from 'react'
import styles from './CmsContentWrapper.module.scss'

interface CmsContentWrapperProps {
  children: ReactNode
}

function CmsContentWrapper({ children }: CmsContentWrapperProps): React.JSX.Element {
  return <div className={styles.wrapper} data-testid="CMS-contentWrapper">{children}</div>
}

export default CmsContentWrapper
