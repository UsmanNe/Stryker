import React from "react";
import styles from "../../styles/Invoice.module.css";

export const Header = ({ loading }) => {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <div className={styles.logo}>IA</div>
        <div>
          <h1 className={styles.title}>Invoice Intelligence</h1>
          <p className={styles.subtitle}>Autonomous Document Processing</p>
        </div>
      </div>
      <div className={loading ? styles.statusActive : styles.statusIdle}>
        {loading ? "AI Processing..." : "Ready for Upload"}
      </div>
    </header>
  );
};
