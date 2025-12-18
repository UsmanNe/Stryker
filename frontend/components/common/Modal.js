import React from "react";
import styles from "../../styles/Invoice.module.css";

export const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};
