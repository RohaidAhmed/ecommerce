import { create } from 'zustand'

type UIStore = {
    mobileMenuOpen: boolean
    openMobileMenu: () => void
    closeMobileMenu: () => void
}

export const useUIStore = create<UIStore>()((set) => ({
    mobileMenuOpen: false,
    openMobileMenu: () => set({ mobileMenuOpen: true }),
    closeMobileMenu: () => set({ mobileMenuOpen: false }),
}))