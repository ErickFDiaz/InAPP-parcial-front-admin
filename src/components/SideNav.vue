<script setup lang="ts">
import { useAuthStore } from '../stores/auth'
import { 
  HomeIcon, 
  UserGroupIcon, 
  DocumentTextIcon,
  TruckIcon
} from '@heroicons/vue/24/outline'

const authStore = useAuthStore()

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
    <div class="hidden md:flex md:flex-shrink-0">
      <div class="flex flex-col w-64">
        <div class="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-white border-r">
          <div class="flex items-center flex-shrink-0 px-4">
            <TruckIcon class="h-8 w-8 text-primary mr-2" />
            <h1 class="text-xl font-bold text-gray-900">Electrysure</h1>
          </div>
          <div class="mt-8 flex-grow flex flex-col">
            <nav class="flex-1 px-2 space-y-2">
              <router-link
                v-for="item in navigation"
                :key="item.name"
                :to="item.href"
                class="group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200"
                :class="[
                  $route.path === item.href
                    ? 'bg-emerald-50 text-primary'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
                ]"
              >
                <component
                  :is="item.icon"
                  class="mr-3 flex-shrink-0 h-5 w-5"
                  :class="[
                    $route.path === item.href
                      ? 'text-primary'
                      : 'text-gray-400 group-hover:text-primary'
                  ]"
                />
                {{ item.name }}
              </router-link>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="flex flex-col flex-1">
      <slot></slot>
    </div>
  </div>
</template>