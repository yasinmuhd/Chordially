import { Pressable, StyleSheet, Text, View } from "react-native"

interface Props {
  onSuggestionPress: (suggestion: string) => void
  genre?: string | null
  location?: string | null
}

const SUGGESTIONS = [
  "Try different genre",
  "Broaden location",
  "Reset filters",
] as const

export default function EmptyDiscoveryState({
  onSuggestionPress,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.illustration}>
        <Text style={styles.illustrationIcon}>🎵</Text>
      </View>

      <Text style={styles.title}>No results found</Text>
      <Text style={styles.subtitle}>
        Try adjusting your search or filters
      </Text>

      <View style={styles.suggestionsContainer}>
        {SUGGESTIONS.map((suggestion) => (
          <Pressable
            key={suggestion}
            style={({ pressed }) => [
              styles.chip,
              pressed && styles.chipPressed,
            ]}
            onPress={() => onSuggestionPress(suggestion)}
            accessibilityRole="button"
            accessibilityLabel={suggestion}
          >
            <Text style={styles.chipText}>{suggestion}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  illustration: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  illustrationIcon: {
    fontSize: 36,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#888",
    textAlign: "center",
    marginBottom: 24,
  },
  suggestionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  chipPressed: {
    backgroundColor: "#e0e0e0",
  },
  chipText: {
    fontSize: 14,
    color: "#555",
    fontWeight: "500",
  },
})
