export type PaymentStatusCode =
  | "pending"
  | "processing"
  | "confirmed"
  | "failed"
  | "refunded"
  | "reversed";

export interface PaymentStatus {
  paymentId: string;
  code: PaymentStatusCode;
  updatedAt: string;
  message?: string;
}

export const terminalStatuses: PaymentStatusCode[] = ["confirmed", "failed", "refunded", "reversed"];

export function isTerminal(status: PaymentStatusCode): boolean {
  return terminalStatuses.includes(status);
}

export function isPending(status: PaymentStatusCode): boolean {
  return status === "pending" || status === "processing";
}

export function statusLabel(code: PaymentStatusCode): string {
  const labels: Record<PaymentStatusCode, string> = {
    pending: "Awaiting processing",
    processing: "In progress",
    confirmed: "Confirmed",
    failed: "Failed",
    refunded: "Refunded",
    reversed: "Reversed",
  };
  return labels[code];
}
