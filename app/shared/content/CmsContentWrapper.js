import styles from './CmsContentWrapper.module.scss';

function CmsContentWrapper({ children }) {
  return <div className={styles.wrapper}>{children}</div>;
}

export default CmsContentWrapper;
