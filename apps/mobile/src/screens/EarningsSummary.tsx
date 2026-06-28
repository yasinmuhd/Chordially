import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface EarningsPeriod {
  label: string;
  amount: number;
  currency: string;
}

interface EarningsSummaryProps {
  creatorName: string;
  periods: EarningsPeriod[];
  totalXLM: number;
}

function PeriodRow({ period }: { period: EarningsPeriod }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{period.label}</Text>
      <Text style={styles.amount}>{period.amount} {period.currency}</Text>
    </View>
  );
}

export function EarningsSummary({ creatorName, periods, totalXLM }: EarningsSummaryProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>{creatorName}&apos;s Earnings</Text>
      {periods.map((p) => <PeriodRow key={p.label} period={p} />)}
      <View style={styles.total}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalAmount}>{totalXLM} XLM</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#e5e7eb" },
  label: { color: "#374151" },
  amount: { fontWeight: "600" },
  total: { flexDirection: "row", justifyContent: "space-between", marginTop: 12, paddingTop: 12, borderTopWidth: 2, borderTopColor: "#6366f1" },
  totalLabel: { fontWeight: "bold", fontSize: 16 },
  totalAmount: { fontWeight: "bold", fontSize: 16, color: "#6366f1" },
});
