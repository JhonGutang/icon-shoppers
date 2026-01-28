import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface TokenState {
  accessToken: string | null
  userType: string | null
  id: number | null
  isLoggingOut: boolean;
  isSellerMode: boolean;
  hasShop: boolean;
  needsRoleSelection: boolean;
  setAuth: (token: string | null, userType: string | null, id: number | null, hasShop: boolean, needsRoleSelection?: boolean) => void
  clearAuth: () => void
  logout: () => void
  setLoggingOut: (loggingOut: boolean) => void
  toggleSellerMode: () => void
  setSellerMode: (mode: boolean) => void
  setNeedsRoleSelection: (needs: boolean) => void
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
      hasShop: false,
      needsRoleSelection: false,
      setAuth: (token, userType, id, hasShop, needsRoleSelection = false) => 
        set({ accessToken: token, userType: userType, id: id, hasShop: hasShop, needsRoleSelection: needsRoleSelection, isSellerMode: false }),
      clearAuth: () => set({ accessToken: null, userType: null, id: null, hasShop: false, needsRoleSelection: false, isSellerMode: false }),
      logout: () => set({ accessToken: null, userType: null, id: null, hasShop: false, needsRoleSelection: false, isSellerMode: false }),
      setLoggingOut: (loggingOut) => set({ isLoggingOut: loggingOut }),
      toggleSellerMode: () => set((state) => ({ isSellerMode: !state.isSellerMode })),
      setSellerMode: (mode) => set({ isSellerMode: mode }),
      setNeedsRoleSelection: (needs) => set({ needsRoleSelection: needs }),
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
