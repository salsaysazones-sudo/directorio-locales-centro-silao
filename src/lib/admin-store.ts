'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AdminStore {
  token: string | null
  isAuthed: boolean
  login: (token: string) => boolean
  logout: () => void
}

const VALID_TOKEN = process.env.NEXT_PUBLIC_ADMIN_TOKEN || 'admin-directorio-2026'

export const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
      token: null,
      isAuthed: false,
      login: (token: string) => {
        if (token === VALID_TOKEN) {
          set({ token, isAuthed: true })
          return true
        }
        return false
      },
      logout: () => set({ token: null, isAuthed: false }),
    }),
    { name: 'directorio-silao-admin' }
  )
)
