import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '../types'
import { watch } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = ref(false)

  const savedUser = localStorage.getItem('user')
  if (savedUser) {
    user.value = JSON.parse(savedUser)
    isAuthenticated.value = true
  }

  watch(user, (newUser) => {
    if (newUser) {
      localStorage.setItem('user', JSON.stringify(newUser))
      localStorage.setItem('isAuthenticated', 'true')
    } else {
      localStorage.removeItem('user')
      localStorage.setItem('isAuthenticated', 'false')
    }
  }, { deep: true })

  const login = async (email: string, password: string) => {
    // Mock login - In production, this would be an API call
    await new Promise((res) => setTimeout(res, 800))
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

