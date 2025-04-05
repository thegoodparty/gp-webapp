import styles from './CmsContentWrapper.module.scss'

function CmsContentWrapper({ children }) {
  return <div className={styles.wrapper} data-testid="CMS-contentWrapper">{children}</div>
}

export default CmsContentWrapper
