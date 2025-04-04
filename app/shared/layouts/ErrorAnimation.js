import styles from './ErrorAnimation.module.scss'
export default function ErrorAnimation() {
  return (
    <>
      <h1 className={styles.h1}>500</h1>
      <h2 className={styles.h2}>
        Unexpected Error <b>:(</b>
      </h2>
      <div className={styles.gears}>
        <div className={`${styles.gear} ${styles.one}`}>
          <div className={styles.bar}></div>
          <div className={styles.bar}></div>
          <div className={styles.bar}></div>
        </div>
        <div className={`${styles.gear} ${styles.two}`}>
          <div className={styles.bar}></div>
          <div className={styles.bar}></div>
          <div className={styles.bar}></div>
        </div>
        <div className={`${styles.gear} ${styles.three}`}>
          <div className={styles.bar}></div>
          <div className={styles.bar}></div>
          <div className={styles.bar}></div>
        </div>
      </div>
    </>
  )
}
