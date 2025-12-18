import React, { useRef } from "react";
import styles from "../../styles/Invoice.module.css";
import { Button } from "../common/Button";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const InvoiceUpload = ({
  file,
  setFile,
  handleUpload,
  handleExtract,
  uploaded,
}) => {
  const inputRef = useRef(null);

  const onFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const onUploadClick = async () => {
    if (!file) return;
    try {
      await handleUpload();
      toast.success("File uploaded successfully!");
    } catch (err) {
      toast.error("Upload failed. Check connection.");
    }
  };

  const onExtractClick = async () => {
    try {
      await handleExtract();
      toast.success("Extraction completed!");
      // Clear file input after extraction
      setFile(null);
      if (inputRef.current) inputRef.current.value = null;
    } catch (err) {
      toast.error("Extraction failed. Try again.");
    }
  };

  return (
    <div className={styles.cardPremium}>
      <h3 className={styles.sectionTitle}>Import Source</h3>

      <div className={styles.dropZone}>
        <input
          ref={inputRef}
          type="file"
          accept="image/png"
          onChange={onFileChange}
          className={styles.hiddenInput}
          id="fileInput"
        />
        <label htmlFor="fileInput" className={styles.fileLabel}>
          <span className={styles.icon}>📂</span>
          {file ? file.name : "Drop invoice or click to browse (PNG only)"}
        </label>
      </div>
      <div className={styles.buttonStack}>
        {uploaded ? (
          <Button onClick={onExtractClick}>
            {!uploaded ? "Extracting..." : "Run Extraction"}
          </Button>
        ) : (
          <Button onClick={onUploadClick} type="secondary">
            {!uploaded ? "Upload" : "Uploaded"}
          </Button>
        )}
      </div>
    </div>
  );
};
