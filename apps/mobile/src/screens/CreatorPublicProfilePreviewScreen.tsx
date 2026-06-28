import { Linking, Pressable, StyleSheet, Text, View, Image } from "react-native"

export interface CreatorProfilePreviewData {
  displayName: string
  handle: string
  headline: string
  bio: string
  location: string
  avatarUrl: string | null
  bannerUrl: string | null
  socialLinks: {
    website: string
    instagram: string
    x: string
  }
  isVerified: boolean
}

interface Props {
  profile: CreatorProfilePreviewData
}

export default function CreatorPublicProfilePreviewScreen({ profile }: Props) {
  const socialLinks = Object.entries(profile.socialLinks).filter(([, value]) => Boolean(value))

  return (
    <View style={styles.card}>
      {profile.bannerUrl ? (
        <Image source={{ uri: profile.bannerUrl }} style={styles.banner} />
      ) : (
        <View style={[styles.banner, styles.bannerPlaceholder]} />
      )}

      <View style={styles.content}>
        {profile.avatarUrl ? (
          <Image source={{ uri: profile.avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]} />
        )}

        <Text style={styles.displayName}>{profile.displayName}</Text>
        <Text style={styles.handle}>{profile.handle}</Text>
        {profile.isVerified ? <Text style={styles.verified}>Verified</Text> : null}
        <Text style={styles.headline}>{profile.headline}</Text>
        <Text style={styles.bio}>{profile.bio}</Text>
        {profile.location ? <Text style={styles.meta}>📍 {profile.location}</Text> : null}

        {socialLinks.length > 0 ? (
          <View style={styles.socialRow}>
            {socialLinks.map(([key, value]) => (
              <Pressable
                key={key}
                onPress={() => Linking.openURL(value)}
                style={styles.socialButton}
              >
                <Text style={styles.socialButtonText}>{key}</Text>
              </Pressable>
            ))}
          </View>
        ) : null}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  banner: {
    height: 140,
    backgroundColor: "#111827",
  },
  bannerPlaceholder: {
    backgroundColor: "#d1d5db",
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    alignItems: "center",
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    marginTop: -44,
    borderWidth: 4,
    borderColor: "#ffffff",
  },
  avatarPlaceholder: {
    backgroundColor: "#e5e7eb",
  },
  displayName: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  handle: {
    color: "#6b7280",
    fontSize: 14,
    marginTop: 2,
  },
  verified: {
    marginTop: 6,
    color: "#2563eb",
    fontWeight: "600",
  },
  headline: {
    marginTop: 8,
    fontSize: 14,
    color: "#374151",
    textAlign: "center",
  },
  bio: {
    marginTop: 8,
    fontSize: 14,
    color: "#4b5563",
    textAlign: "center",
  },
  meta: {
    marginTop: 8,
    fontSize: 13,
    color: "#4b5563",
  },
  socialRow: {
    marginTop: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  socialButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#eff6ff",
  },
  socialButtonText: {
    color: "#2563eb",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
})
