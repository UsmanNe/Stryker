import React from "react";
import styles from "../../styles/Invoice.module.css";

export const Loader = ({ loading }) => {
  if (!loading) return null;
  return <div className={styles.loaderOverlay}>Loading...</div>;
};
