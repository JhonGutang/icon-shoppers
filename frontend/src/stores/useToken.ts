import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface TokenState {
  accessToken: string | null
  userType: string | null
  id: number | null
  setAuth: (token: string | null, userType: string | null, id: number | null) => void
  clearAuth: () => void
  hasHydrated: boolean
  setHasHydrated: (hydrated: boolean) => void
}

const useAuth = create<TokenState>()(
  persist(
    (set) => ({
      accessToken: null,
      userType: null,
      id: null,
      setAuth: (token, userType, id) => set({ accessToken: token, userType: userType, id: id }),
      clearAuth: () => set({ accessToken: null, userType: null, id: null }),
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
