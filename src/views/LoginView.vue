<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')

const loading = ref(false)

const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const handleLogin = async () => {
  error.value = ''
  if (!email.value || !password.value) {
    error.value = 'Completa todos los campos.'
    return
  }
  if (!isValidEmail(email.value)) {
    error.value = 'Ingresa un correo válido.'
    return
  }
  loading.value = true
  const success = await authStore.login(email.value, password.value)
  loading.value = false
  if (success) {
    router.push('/dashboard')
  } else {
    error.value = 'Credenciales inválidas'
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <div class="text-center">
        <div class="flex justify-center">
          <img class="h-14 w-14 text-primary" src="/truck.png" />
        </div>
        <h2 class="mt-6 text-3xl font-bold tracking-tight text-gray-900">Electrysure</h2>
        <p class="mt-2 text-sm text-gray-600">Portal de Administración</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="mt-8 space-y-6" novalidate>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              v-model="email"
              required
              :aria-invalid="error && !email ? 'true' : 'false'"
              aria-describedby="email-error"
              class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              v-model="password"
              required
              :aria-invalid="error && !password ? 'true' : 'false'"
              aria-describedby="password-error"
              class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        <div v-if="error" class="text-red-500 text-sm text-center" role="alert" id="form-error">
          {{ error }}
        </div>
        
        <button
          type="submit"
          class="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
          :disabled="loading"
        >
        {{ loading ? 'Ingresando...' : 'Iniciar Sesión' }}
        </button>
      </form>
    </div>
  </div>
</template>