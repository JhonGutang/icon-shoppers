import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface TokenState {
  accessToken: string | null
  userType: string | null
  setAuth: (token: string | null, userType: string | null) => void
  clearAuth: () => void
  hasHydrated: boolean
  setHasHydrated: (hydrated: boolean) => void
}

const useAuth = create<TokenState>()(
  persist(
    (set) => ({
      accessToken: null,
      userType: null,
      setAuth: (token, userType) => set({ accessToken: token, userType }),
      clearAuth: () => set({ accessToken: null, userType: null }),
      hasHydrated: false,
      setHasHydrated: (hydrated) => set({ hasHydrated: hydrated }),
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)

export default useAuth
