import axios from "axios";
import { API_URL } from "../utils/constants";

export const uploadFile = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return axios.post(`${API_URL}/upload`, formData);
};

export const extractInvoice = (filePath) =>
  axios.post(`${API_URL}/extract`, { file_path: filePath });

export const getInvoices = () => axios.get(`${API_URL}/invoices`);

export const updateInvoice = (id, structuredData, rawText) =>
  axios.put(`${API_URL}/update_invoice/${id}`, {
    structured_data: structuredData,
    raw_text: rawText,
  });
