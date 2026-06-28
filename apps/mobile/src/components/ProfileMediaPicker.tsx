import { useState } from "react"
import { Image, Pressable, StyleSheet, Text, View } from "react-native"
import { useImagePicker } from "../hooks/useImagePicker"

interface Props {
  currentUrl?: string | null
  previewUrl?: string | null
  label: string
  hint: string
  variant?: "avatar" | "banner"
  onImagePicked: (uri: string, mimeType: string) => void
}

export default function ProfileMediaPicker({
  currentUrl,
  previewUrl,
  label,
  hint,
  variant = "avatar",
  onImagePicked,
}: Props) {
  const { image, error, pickImage } = useImagePicker()
  const [hasPicked, setHasPicked] = useState(false)

  const displayUri = (hasPicked ? image?.uri : previewUrl) ?? currentUrl

  async function handlePress() {
    const picked = await pickImage()
    if (picked) {
      setHasPicked(true)
      onImagePicked(picked.uri, picked.mimeType)
    }
  }

  const isBanner = variant === "banner"

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel={`${label} picker`}
      >
        {displayUri ? (
          <Image
            source={{ uri: displayUri }}
            style={isBanner ? styles.bannerPreview : styles.avatarPreview}
            accessibilityLabel={`${label} preview`}
          />
        ) : (
          <View
            style={[
              isBanner ? styles.bannerPreview : styles.avatarPreview,
              styles.placeholder,
            ]}
          >
            <Text style={styles.placeholderText}>+</Text>
          </View>
        )}
      </Pressable>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Text style={styles.hint}>{hint}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 8,
  },
  avatarPreview: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  bannerPreview: {
    width: 260,
    height: 120,
    borderRadius: 16,
  },
  placeholder: {
    backgroundColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    fontSize: 28,
    color: "#6b7280",
  },
  hint: {
    marginTop: 8,
    color: "#6b7280",
    fontSize: 13,
    textAlign: "center",
  },
  error: {
    color: "#dc2626",
    marginTop: 8,
    fontSize: 13,
  },
})
