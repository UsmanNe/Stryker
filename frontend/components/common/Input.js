import React from "react";
import styles from "../../styles/Invoice.module.css";

export const Input = ({ value, onChange, placeholder, small, bold }) => {
  const className = small
    ? styles.itemInputSmall
    : bold
    ? styles.inlineInputBold
    : styles.inlineInput;
  return (
    <input
      className={className}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
};
