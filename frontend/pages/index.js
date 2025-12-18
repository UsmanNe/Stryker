import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Header } from "../components/Layout/Header";
import { InvoiceUpload } from "../components/Invoice/InvoiceUpload";
import { InvoiceLedger } from "../components/Invoice/InvoiceLedger";
import { Loader } from "../components/common/Loader";
import {
  uploadFile,
  extractInvoice,
  getInvoices,
  updateInvoice,
} from "../api/invoiceApi";
import styles from "../styles/Invoice.module.css";

export default function Home() {
  const [file, setFile] = useState(null);
  const [filePath, setFilePath] = useState("");
  const [structuredData, setStructuredData] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    try {
      setLoading(true);
      setUploaded(false);
      const res = await uploadFile(file);
      setFilePath(res.data.file_path);
      setUploaded(true);
      toast.success("File uploaded successfully!");
    } catch {
      toast.error("Upload failed. Check connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleExtract = async () => {
    if (!uploaded || !filePath) {
      toast.error("First, you need to upload a file.");
      return;
    }
    try {
      setLoading(true);
      const res = await extractInvoice(filePath);
      setStructuredData(res.data.structured_data);
      await fetchInvoices();
      toast.success("Extraction completed!");
      setFile(null);
      setUploaded(false);
    } catch {
      toast.error("AI Extraction engine failed.");
    } finally {
      setLoading(false);
    }
  };

  const fetchInvoices = async () => {
    try {
      const res = await getInvoices();
      setInvoices(res.data);
    } catch {
      toast.error("Failed to fetch invoices.");
    }
  };

  const handleHeaderEdit = (invIndex, field, value) => {
    const updated = [...invoices];
    updated[invIndex].structured_data[field] = value;
    setInvoices(updated);
  };

  const handleLineItemEdit = (invIndex, itemIndex, field, value) => {
    const updated = [...invoices];
    updated[invIndex].structured_data.LineItems[itemIndex][field] = value;
    setInvoices(updated);
  };

  const addLineItem = (invIndex) => {
    const updated = [...invoices];
    updated[invIndex].structured_data.LineItems.push({
      Product: "",
      Quantity: "",
      Price: "",
    });
    setInvoices(updated);
  };

  const removeLineItem = (invIndex, itemIndex) => {
    const updated = [...invoices];
    updated[invIndex].structured_data.LineItems.splice(itemIndex, 1);
    setInvoices(updated);
  };

  const saveInvoice = async (invoice) => {
    try {
      await updateInvoice(
        invoice.id,
        invoice.structured_data,
        invoice.raw_text
      );
      await fetchInvoices();
      toast.success("Ledger synchronized successfully.");
    } catch {
      toast.error("Failed to save invoice.");
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <div className={styles.container}>
      <Loader loading={loading} />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className={styles.wrapper}>
        <Header loading={loading} />
        <main className={styles.mainGrid}>
          <section className={styles.actionCenter}>
            <InvoiceUpload
              file={file}
              setFile={setFile}
              handleUpload={handleUpload}
              handleExtract={handleExtract}
              uploaded={uploaded}
              loading={loading}
            />
            {structuredData && (
              <div className={`${styles.cardPremium} ${styles.fadeIn}`}>
                <h3 className={styles.sectionTitle}>AI Confidence Data</h3>
                <pre className={styles.jsonPreview}>
                  {JSON.stringify(structuredData, null, 2)}
                </pre>
              </div>
            )}
          </section>
          <section className={styles.ledgerArea}>
            <InvoiceLedger
              invoices={invoices}
              handleHeaderEdit={handleHeaderEdit}
              handleLineItemEdit={handleLineItemEdit}
              addLineItem={addLineItem}
              removeLineItem={removeLineItem}
              saveInvoice={saveInvoice}
              fetchInvoices={fetchInvoices}
            />
          </section>
        </main>
      </div>
    </div>
  );
}
