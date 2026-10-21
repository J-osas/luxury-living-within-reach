import { useSyncExternalStore } from "react"
import { usePlayer } from "@/store/player"

export function useHydrated() {
  return useSyncExternalStore(
    (onStoreChange) => usePlayer.persist.onFinishHydration(onStoreChange),
    () => usePlayer.persist.hasHydrated(),
    () => false
  )
}
