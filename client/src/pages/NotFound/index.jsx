import React from "react";
import styles from "../../assets/styles/notFound.module.scss";

const NotFound = () => {
  return (
    <div className={styles.container}>
      <img src="/images/404error.gif" alt="" />
      <div className={styles.content}>
        <h1 className={styles.heading}>Oops!</h1>
        <p className={styles.message}>We can't seem to find the page you're looking for.</p>
        <a href="/" className={styles.homeLink}>Go Back to Home</a>
      </div>
    </div>
  );
};

export default NotFound;
