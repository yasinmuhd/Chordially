"use client";
import React from "react";

type PaymentStatus = "pending" | "confirmed" | "failed" | "refunded";

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  createdAt: string;
  recipient: string;
}

const statusColors: Record<PaymentStatus, string> = {
  pending: "#f59e0b",
  confirmed: "#22c55e",
  failed: "#ef4444",
  refunded: "#6b7280",
};

function StatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <span style={{ background: statusColors[status], color: "#fff", padding: "2px 8px", borderRadius: 12, fontSize: 12 }}>
      {status}
    </span>
  );
}

export function PaymentHistoryTable({ payments }: { payments: Payment[] }) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          {["Date", "Recipient", "Amount", "Status"].map((h) => (
            <th key={h} style={{ textAlign: "left", padding: "8px 12px", borderBottom: "1px solid #e5e7eb" }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {payments.map((p) => (
          <tr key={p.id}>
            <td style={{ padding: "8px 12px" }}>{new Date(p.createdAt).toLocaleDateString()}</td>
            <td style={{ padding: "8px 12px" }}>{p.recipient}</td>
            <td style={{ padding: "8px 12px" }}>{p.amount} {p.currency}</td>
            <td style={{ padding: "8px 12px" }}><StatusBadge status={p.status} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
