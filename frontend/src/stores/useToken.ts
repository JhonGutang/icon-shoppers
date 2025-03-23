import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface TokenState {
  accessToken: string | null
  userType: string | null
  shopId: number | null
  setAuth: (token: string | null, userType: string | null, shopId: number | null) => void
  clearAuth: () => void
  hasHydrated: boolean
  setHasHydrated: (hydrated: boolean) => void
}

const useAuth = create<TokenState>()(
  persist(
    (set) => ({
      accessToken: null,
      userType: null,
      shopId: null,
      setAuth: (token, userType, shopId) => set({ accessToken: token, userType: userType, shopId: shopId }),
      clearAuth: () => set({ accessToken: null, userType: null, shopId: null }),
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
