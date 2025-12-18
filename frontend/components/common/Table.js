import React from "react";
import styles from "../../styles/Invoice.module.css";

export const Table = ({ children }) => {
  return <table className={styles.modernTable}>{children}</table>;
};
