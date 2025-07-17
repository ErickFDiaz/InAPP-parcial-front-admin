<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const showModal = ref(false)

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const confirmLogout = () => {
  showModal.value = false
  handleLogout()
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
          @click="showModal = true"
          class="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors duration-200"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
        <h2 class="text-lg font-semibold mb-4 text-gray-800">¿Deseas cerrar sesión?</h2>
        <div class="flex justify-end gap-3">
          <button
            @click="showModal = false"
            class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-sm text-gray-800">
            Cancelar
          </button>
          <button
            @click="confirmLogout"
            class="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 text-sm">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  </header>
</template>
