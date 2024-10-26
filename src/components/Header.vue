<script setup lang="ts">
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <header class="bg-white border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900">
        <slot></slot>
      </h1>
      <div class="flex items-center gap-6">
        <div class="flex items-center gap-2">
          <div class="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
            <span class="text-sm font-medium text-primary">
              {{ authStore.user?.name[0].toUpperCase() }}
            </span>
          </div>
          <span class="text-sm font-medium text-gray-700">{{ authStore.user?.name }}</span>
        </div>
        <button
          @click="handleLogout"
          class="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors duration-200"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  </header>
</template>