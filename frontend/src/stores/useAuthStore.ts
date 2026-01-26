import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface TokenState {
  accessToken: string | null
  userType: string | null
  id: number | null
  isLoggingOut: boolean;
  isSellerMode: boolean;
  setAuth: (token: string | null, userType: string | null, id: number | null) => void
  clearAuth: () => void
  logout: () => void
  setLoggingOut: (loggingOut: boolean) => void
  toggleSellerMode: () => void
  setSellerMode: (mode: boolean) => void
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
      isLoggingOut: false,
      isSellerMode: false,
      setAuth: (token, userType, id) => set({ accessToken: token, userType: userType, id: id, isSellerMode: false }),
      clearAuth: () => set({ accessToken: null, userType: null, id: null, isSellerMode: false }),
      logout: () => set({ accessToken: null, userType: null, id: null, isSellerMode: false }),
      setLoggingOut: (loggingOut) => set({ isLoggingOut: loggingOut }),
      toggleSellerMode: () => set((state) => ({ isSellerMode: !state.isSellerMode })),
      setSellerMode: (mode) => set({ isSellerMode: mode }),
      hasHydrated: false,
      setHasHydrated: (hydrated) => set({ hasHydrated: hydrated }),
      
      // Helper methods
      isAuthenticated: () => !!get().accessToken,
      isCustomer: () => get().userType === 'customer',
      isSeller: () => get().userType === 'merchant',
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
