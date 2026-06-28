import { useCallback, useEffect, useState } from "react"
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native"
import CompactCreatorCard, {
  type CreatorCardData,
} from "../components/CompactCreatorCard"
import EmptyDiscoveryState from "../components/EmptyDiscoveryState"
import {
  discoverCreators,
  type DiscoverResponse,
} from "../services/discover-service"

const PAGE_SIZE = 20
const SORT_OPTIONS = ["Relevance", "Followers", "Newest"] as const

interface Filters {
  genre: string
  location: string
  sort: string
}

interface State {
  creators: CreatorCardData[]
  page: number
  hasMore: boolean
  isLoading: boolean
  isRefreshing: boolean
  error: string | null
  filters: Filters
}

const initialFilters: Filters = {
  genre: "",
  location: "",
  sort: "Relevance",
}

export default function ExploreScreen() {
  const [state, setState] = useState<State>({
    creators: [],
    page: 1,
    hasMore: true,
    isLoading: true,
    isRefreshing: false,
    error: null,
    filters: { ...initialFilters },
  })

  const loadCreators = useCallback(
    async (
      page: number,
      filters: Filters,
      append: boolean
    ) => {
      const { genre, location, sort } = filters
      try {
        const data: DiscoverResponse = await discoverCreators({
          page,
          limit: PAGE_SIZE,
          genre: genre || null,
          location: location || null,
          sort: sort !== "Relevance" ? sort.toLowerCase() : null,
        })

        setState((prev) => ({
          ...prev,
          creators: append
            ? [...prev.creators, ...data.creators]
            : data.creators,
          page: data.page,
          hasMore: data.hasMore,
          isLoading: false,
          isRefreshing: false,
          error: null,
        }))
      } catch {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          isRefreshing: false,
          error: "Failed to load creators. Please try again.",
        }))
      }
    },
    []
  )

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      isLoading: true,
      creators: [],
      page: 1,
      error: null,
    }))
    loadCreators(1, state.filters, false)
  }, [state.filters, loadCreators])

  function handleRefresh() {
    setState((prev) => ({ ...prev, isRefreshing: true }))
    loadCreators(1, state.filters, false)
  }

  function handleLoadMore() {
    if (state.isLoading || !state.hasMore) return
    loadCreators(state.page + 1, state.filters, true)
  }

  function handleSuggestionPress(suggestion: string) {
    switch (suggestion) {
      case "Try different genre":
        setState((prev) => ({
          ...prev,
          filters: { ...prev.filters, genre: "" },
        }))
        break
      case "Broaden location":
        setState((prev) => ({
          ...prev,
          filters: { ...prev.filters, location: "" },
        }))
        break
      case "Reset filters":
        setState((prev) => ({
          ...prev,
          filters: { ...initialFilters },
        }))
        break
    }
  }

  function handleCreatorPress(slug: string) {
    console.log("Navigate to creator profile:", slug)
  }

  function handleFollowToggle(slug: string) {
    setState((prev) => ({
      ...prev,
      creators: prev.creators.map((c) =>
        c.slug === slug ? { ...c, isFollowing: !c.isFollowing } : c
      ),
    }))
  }

  function renderHeader() {
    return (
      <View style={styles.filterBar}>
        <TextInput
          style={styles.filterInput}
          placeholder="Genre"
          placeholderTextColor="#aaa"
          value={state.filters.genre}
          onChangeText={(text) =>
            setState((prev) => ({
              ...prev,
              filters: { ...prev.filters, genre: text },
            }))
          }
          accessibilityLabel="Filter by genre"
        />
        <TextInput
          style={styles.filterInput}
          placeholder="Location"
          placeholderTextColor="#aaa"
          value={state.filters.location}
          onChangeText={(text) =>
            setState((prev) => ({
              ...prev,
              filters: { ...prev.filters, location: text },
            }))
          }
          accessibilityLabel="Filter by location"
        />
        <View style={styles.sortContainer}>
          {SORT_OPTIONS.map((option) => (
            <Pressable
              key={option}
              style={[
                styles.sortOption,
                state.filters.sort === option && styles.sortOptionActive,
              ]}
              onPress={() =>
                setState((prev) => ({
                  ...prev,
                  filters: { ...prev.filters, sort: option },
                }))
              }
              accessibilityRole="button"
              accessibilityLabel={`Sort by ${option}`}
            >
              <Text
                style={[
                  styles.sortOptionText,
                  state.filters.sort === option &&
                    styles.sortOptionTextActive,
                ]}
              >
                {option}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    )
  }

  function renderItem({ item }: { item: CreatorCardData }) {
    return (
      <CompactCreatorCard
        creator={item}
        onPress={handleCreatorPress}
        isFollowing={item.isFollowing ?? false}
        onFollowToggle={handleFollowToggle}
      />
    )
  }

  function renderFooter() {
    if (!state.isLoading || state.creators.length === 0) return null
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" />
      </View>
    )
  }

  function renderEmpty() {
    if (state.isLoading) return null
    return (
      <EmptyDiscoveryState
        genre={state.filters.genre}
        location={state.filters.location}
        onSuggestionPress={handleSuggestionPress}
      />
    )
  }

  if (state.isLoading && state.creators.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator testID="loading-indicator" size="large" />
      </View>
    )
  }

  if (state.error && state.creators.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{state.error}</Text>
        <Pressable
          style={styles.retryButton}
          onPress={() => {
            setState((prev) => ({ ...prev, isLoading: true, error: null }))
            loadCreators(1, state.filters, false)
          }}
          accessibilityRole="button"
          accessibilityLabel="Retry loading creators"
        >
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={state.creators}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={state.isRefreshing}
            onRefresh={handleRefresh}
            tintColor="#4a90d9"
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        contentContainerStyle={
          state.creators.length === 0 ? styles.emptyList : undefined
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  filterBar: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#fafafa",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e0e0e0",
  },
  filterInput: {
    height: 40,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  sortContainer: {
    flexDirection: "row",
    gap: 8,
  },
  sortOption: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
  },
  sortOptionActive: {
    backgroundColor: "#4a90d9",
  },
  sortOptionText: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },
  sortOptionTextActive: {
    color: "#fff",
  },
  footer: {
    paddingVertical: 16,
    alignItems: "center",
  },
  emptyList: {
    flexGrow: 1,
  },
  errorText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    backgroundColor: "#4a90d9",
    borderRadius: 8,
  },
  retryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
})
