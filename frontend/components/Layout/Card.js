import React from "react";
import styles from "../../styles/Invoice.module.css";

export const Card = ({ children, fadeIn }) => {
  return (
    <div className={`${styles.cardPremium} ${fadeIn ? styles.fadeIn : ""}`}>
      {children}
    </div>
  );
};
