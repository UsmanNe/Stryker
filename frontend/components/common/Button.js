import React from "react";
import styles from "../../styles/Invoice.module.css";

export const Button = ({ children, onClick, type = "primary", disabled }) => {
  return (
    <button
      className={type === "primary" ? styles.btnPrimary : styles.btnSecondary}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
