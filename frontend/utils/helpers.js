export const formatCurrency = (value) => {
  if (!value) return "";
  return parseFloat(value).toFixed(2);
};
