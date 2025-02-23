import styles from  "../assets/styles/loader.module.scss";

const Loader = () => {
  return (
    <div className={styles['loader']}>
      <div className={styles['loader-inner']}></div>
    </div>
  )
}

export default Loader