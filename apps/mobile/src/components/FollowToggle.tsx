import { useState } from "react"
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
} from "react-native"

interface Props {
  isFollowing: boolean
  onToggle: () => Promise<void>
}

export default function FollowToggle({ isFollowing, onToggle }: Props) {
  const [isLoading, setIsLoading] = useState(false)

  async function handlePress() {
    if (isLoading) return
    setIsLoading(true)
    try {
      await onToggle()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        isFollowing ? styles.following : styles.notFollowing,
        pressed && styles.pressed,
      ]}
      onPress={handlePress}
      disabled={isLoading}
      accessibilityRole="button"
      accessibilityLabel={isFollowing ? "Unfollow" : "Follow"}
      accessibilityState={{ selected: isFollowing }}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={isFollowing ? "#fff" : "#4a90d9"}
        />
      ) : (
        <Text
          style={[
            styles.text,
            isFollowing ? styles.followingText : styles.notFollowingText,
          ]}
        >
          {isFollowing ? "Following" : "Follow"}
        </Text>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    minWidth: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  following: {
    backgroundColor: "#4a90d9",
    borderColor: "#4a90d9",
  },
  notFollowing: {
    backgroundColor: "transparent",
    borderColor: "#4a90d9",
  },
  pressed: {
    opacity: 0.7,
  },
  text: {
    fontSize: 14,
    fontWeight: "600",
  },
  followingText: {
    color: "#fff",
  },
  notFollowingText: {
    color: "#4a90d9",
  },
})
