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
  // Add helper methods
  isAuthenticated: () => boolean
  isCustomer: () => boolean
  isSeller: () => boolean
  hasRole: (role: string) => boolean
}

const useAuthStore = create<TokenState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      userType: null,
      id: null,
      setAuth: (token, userType, id) => set({ accessToken: token, userType: userType, id: id }),
      clearAuth: () => set({ accessToken: null, userType: null, id: null }),
      hasHydrated: false,
      setHasHydrated: (hydrated) => set({ hasHydrated: hydrated }),
      
      // Helper methods
      isAuthenticated: () => !!get().accessToken,
      isCustomer: () => get().userType === 'customer',
      isSeller: () => get().userType === 'seller',
      hasRole: (role) => get().userType === role,
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)

export default useAuthStore
