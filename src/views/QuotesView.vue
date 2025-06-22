<script setup lang="ts">
import { useQuotesStore } from '../stores/quotes'
import SideNav from '../components/SideNav.vue'
import Header from '../components/Header.vue'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const quotesStore = useQuotesStore()
const router = useRouter() // Initialize router

onMounted(() => {
  quotesStore.fetchQuotes()
})

// Añadimos el estado 'lead'
const getStatusInfo = (status: 'lead' | 'pending' | 'approved' | 'rejected') => {
  switch (status) {
    case 'lead':
      return { text: 'Lead', class: 'bg-blue-100 text-blue-800' }
    case 'pending':
      return { text: 'Pendiente', class: 'bg-yellow-100 text-yellow-800' }
    case 'approved':
      return { text: 'Aprobado', class: 'bg-green-100 text-green-800' }
    case 'rejected':
      return { text: 'Rechazado', class: 'bg-red-100 text-red-800' }
    default:
      return { text: status, class: 'bg-gray-100 text-gray-800' }
  }
}

const handleManageQuote = (quoteId: string) => {
  router.push({ name: 'ManageQuote', params: { id: quoteId } })
}
</script>

<template>
  <SideNav>
    <Header>Cotizaciones</Header>
    
    <main class="flex-1 overflow-y-auto bg-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:px-6">
            <h2 class="text-lg font-medium text-gray-900">Lista de Cotizaciones</h2>
          </div>
          
          <div v-if="quotesStore.loading" class="p-4 text-center text-gray-500">
            Cargando cotizaciones...
          </div>
          <div v-else-if="quotesStore.error" class="p-4 text-center text-red-500">
            Error: {{ quotesStore.error }}
          </div>
          <div v-else-if="quotesStore.quotes.length === 0" class="p-4 text-center text-gray-500">
            No hay cotizaciones para mostrar.
          </div>
          
          <div v-else class="border-t border-gray-200">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehículo</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Creación</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="quote in quotesStore.quotes" :key="quote._id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">Doc: {{ quote.document }}</div>
                    <div class="text-sm text-gray-500">Tel: {{ quote.phone }}</div>
                    <div v-if="quote.hasPlate" class="text-sm text-gray-500">
                      Placa: {{ quote.plate }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ quote.brand }} {{ quote.model }}</div>
                    <div class="text-sm text-gray-500">Año: {{ quote.year }}</div>
                    <div class="text-sm text-gray-500">Uso: {{ quote.usage }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ new Date(quote.createdAt).toLocaleString() }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span 
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="getStatusInfo(quote.status).class"
                    >
                      {{ getStatusInfo(quote.status).text }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      @click="handleManageQuote(quote._id)"
                      class="px-3 py-1.5 text-xs font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 transition-colors duration-200"
                    >
                      Gestionar
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  </SideNav>
</template>