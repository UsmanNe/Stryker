import React from "react";
import { Input } from "../common/Input";
import { Button } from "../common/Button";
import styles from "../../styles/Invoice.module.css";

export const InvoiceLedger = ({
  invoices,
  handleHeaderEdit,
  handleLineItemEdit,
  addLineItem,
  removeLineItem,
  saveInvoice,
  fetchInvoices,
}) => {
  return (
    <div className={styles.cardPremium}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>Global Ledger</h2>
        <button onClick={fetchInvoices} className={styles.btnRefresh}>
          ↻
        </button>
      </div>

      <div className={styles.tableScroll}>
        <table className={styles.modernTable}>
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv, invIndex) => (
              <React.Fragment key={inv.id}>
                <tr className={styles.masterRow}>
                  <td>
                    <Input
                      value={inv.structured_data.InvoiceNumber || ""}
                      onChange={(e) =>
                        handleHeaderEdit(
                          invIndex,
                          "InvoiceNumber",
                          e.target.value
                        )
                      }
                    />
                  </td>
                  <td>
                    <Input
                      value={inv.structured_data.InvoiceDate || ""}
                      onChange={(e) =>
                        handleHeaderEdit(
                          invIndex,
                          "InvoiceDate",
                          e.target.value
                        )
                      }
                    />
                  </td>
                  <td>
                    <Input
                      value={inv.structured_data.CustomerName || ""}
                      onChange={(e) =>
                        handleHeaderEdit(
                          invIndex,
                          "CustomerName",
                          e.target.value
                        )
                      }
                    />
                  </td>
                  <td className={styles.textPrimary}>
                    <Input
                      value={inv.structured_data.TotalAmount || ""}
                      onChange={(e) =>
                        handleHeaderEdit(
                          invIndex,
                          "TotalAmount",
                          e.target.value
                        )
                      }
                      bold
                    />
                  </td>
                  <td>
                    <Button onClick={() => saveInvoice(inv)} type="primary">
                      Commit
                    </Button>
                  </td>
                </tr>

                <tr className={styles.detailsRow}>
                  <td colSpan="5">
                    <div className={styles.lineItemBox}>
                      <div className={styles.subTableHeader}>Line Items</div>
                      {inv.structured_data.LineItems?.map((item, itemIndex) => (
                        <div key={itemIndex} className={styles.itemRow}>
                          <Input
                            placeholder="Product"
                            value={item.Product}
                            onChange={(e) =>
                              handleLineItemEdit(
                                invIndex,
                                itemIndex,
                                "Product",
                                e.target.value
                              )
                            }
                          />
                          <Input
                            placeholder="Qty"
                            small
                            value={item.Quantity}
                            onChange={(e) =>
                              handleLineItemEdit(
                                invIndex,
                                itemIndex,
                                "Quantity",
                                e.target.value
                              )
                            }
                          />
                          <Input
                            placeholder="Price"
                            small
                            value={item.Price}
                            onChange={(e) =>
                              handleLineItemEdit(
                                invIndex,
                                itemIndex,
                                "Price",
                                e.target.value
                              )
                            }
                          />
                          <Button
                            onClick={() => removeLineItem(invIndex, itemIndex)}
                            type="secondary"
                          >
                            ✕
                          </Button>
                        </div>
                      ))}
                      <Button onClick={() => addLineItem(invIndex)}>
                        + Add Line Item
                      </Button>
                    </div>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
