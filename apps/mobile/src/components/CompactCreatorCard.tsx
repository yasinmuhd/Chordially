import { Image, Pressable, StyleSheet, Text, View } from "react-native"
import FollowToggle from "./FollowToggle"

export interface CreatorCardData {
  id: string
  slug: string
  displayName: string
  avatarUrl: string | null
  genre: string | null
  location: string | null
  isVerified: boolean
  followerCount: number
  isFollowing?: boolean
}

interface Props {
  creator: CreatorCardData
  onPress: (slug: string) => void
  isFollowing: boolean
  onFollowToggle: (slug: string) => void
}

export default function CompactCreatorCard({
  creator,
  onPress,
  isFollowing,
  onFollowToggle,
}: Props) {
  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={() => onPress(creator.slug)}
      accessibilityRole="button"
      accessibilityLabel={`${creator.displayName}'s profile`}
    >
      {creator.avatarUrl ? (
        <Image
          source={{ uri: creator.avatarUrl }}
          style={styles.avatar}
          accessibilityLabel={`${creator.displayName}'s avatar`}
        />
      ) : (
        <View style={[styles.avatar, styles.placeholderAvatar]} />
      )}

      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>
            {creator.displayName}
          </Text>
          {creator.isVerified && (
            <Text style={styles.verified} accessibilityLabel="Verified">
              ✓
            </Text>
          )}
        </View>
        <Text style={styles.subtitle} numberOfLines={1}>
          {[creator.genre, creator.location].filter(Boolean).join(" · ") ||
            "Creator"}
        </Text>
        <Text style={styles.followers}>
          {creator.followerCount.toLocaleString()} followers
        </Text>
      </View>

      <FollowToggle
        isFollowing={isFollowing}
        onToggle={async () => {
          onFollowToggle(creator.slug)
        }}
      />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e0e0e0",
  },
  pressed: {
    backgroundColor: "#f5f5f5",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  placeholderAvatar: {
    backgroundColor: "#ddd",
  },
  info: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flexShrink: 1,
  },
  verified: {
    fontSize: 14,
    color: "#4a90d9",
    marginLeft: 4,
  },
  subtitle: {
    fontSize: 13,
    color: "#888",
    marginTop: 2,
  },
  followers: {
    fontSize: 12,
    color: "#aaa",
    marginTop: 2,
  },
})
