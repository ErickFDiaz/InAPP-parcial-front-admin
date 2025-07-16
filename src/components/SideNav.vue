<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { 
  HomeIcon, 
  UserGroupIcon, 
  DocumentTextIcon,
  Bars3BottomRightIcon,
  Bars3Icon
} from '@heroicons/vue/24/outline'

const authStore = useAuthStore()

const collapsed = ref(false)

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Cotizaciones', href: '/quotes', icon: DocumentTextIcon },
  ...(authStore.isAdmin() ? [
    { name: 'Empleados', href: '/employees', icon: UserGroupIcon }
  ] : [])
]
</script>

<template>
  <div class="flex h-full min-h-screen">
    <!-- Sidebar -->
    <div
      :class="[
        'bg-white border-r transition-all duration-300 flex flex-col',
        collapsed ? 'w-20' : 'w-64'
      ]"
    >
      <!-- Logo -->
      <div class="flex items-center justify-between p-4">
        <div 
        v-if="!collapsed" class="flex items-center space-x-2">
          <img class="h-8 w-8 text-primary" src="/truck.png" />
          <h1
            class="text-xl font-bold text-gray-900"
          >
            Electrysure
          </h1>
        </div>
        <!-- Botón de colapso -->
        <button
          @click="collapsed = !collapsed"
          class="text-gray-900 hover:text-primary px-2 py-4"
        >
          <component
            :is="collapsed ? Bars3Icon : Bars3BottomRightIcon"
            class="h-5 w-5"
          />
        </button>
      </div>

      <!-- Navegación -->
      <nav class="flex-1 space-y-2 px-2">
        <router-link
  v-for="item in navigation"
  :key="item.name"
  :to="item.href"
  class="group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200"
  :class="[
    $route.path === item.href
      ? 'bg-emerald-50 text-primary'
      : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
  ]"
>
          <component
    :is="item.icon"
    class="h-5 w-5 flex-shrink-0"
    :class="[
      $route.path === item.href
        ? 'text-primary'
        : 'text-gray-400 group-hover:text-primary'
    ]"
  />
          <span
            v-if="!collapsed"
            class="ml-3 transition-opacity duration-200 ease-in"
          >
            {{ item.name }}
          </span>
        </router-link>
      </nav>
    </div>

    <!-- Contenido principal -->
    <div class="flex flex-col flex-1">
      <slot></slot>
    </div>
  </div>
</template>
