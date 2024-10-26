import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '../types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = ref(false)

  const login = async (email: string, password: string) => {
    // Mock login - In production, this would be an API call
    if (email === 'admin@electrysure.com' && password === 'admin123') {
      user.value = { 
        id: 1,
        email, 
        name: 'Admin',
        role: 'admin',
        active: true
      }
      isAuthenticated.value = true
      return true
    } else if (email === 'employee@electrysure.com' && password === 'employee123') {
      user.value = {
        id: 2,
        email,
        name: 'Employee',
        role: 'employee',
        active: true
      }
      isAuthenticated.value = true
      return true
    }
    return false
  }

  const logout = () => {
    user.value = null
    isAuthenticated.value = false
  }

  const isAdmin = () => user.value?.role === 'admin'

  return {
    user,
    isAuthenticated,
    login,
    logout,
    isAdmin
  }
})