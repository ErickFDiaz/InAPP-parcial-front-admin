<script setup lang="ts">
import { useQuotesStore } from '../stores/quotes'
import SideNav from '../components/SideNav.vue'
import Header from '../components/Header.vue'

const quotesStore = useQuotesStore()
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
          
          <div class="border-t border-gray-200">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehículo</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="quote in quotesStore.quotes" :key="quote.id">
                  <td class="px-6 py-4">
                    <div class="text-sm text-gray-900">Doc: {{ quote.clientInfo.documentNumber }}</div>
                    <div class="text-sm text-gray-500">Tel: {{ quote.clientInfo.phoneNumber }}</div>
                    <div v-if="quote.clientInfo.hasPlate" class="text-sm text-gray-500">
                      Placa: {{ quote.clientInfo.plate }}
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm text-gray-900">{{ quote.vehicleInfo.brand }} {{ quote.vehicleInfo.model }}</div>
                    <div class="text-sm text-gray-500">Año: {{ quote.vehicleInfo.year }}</div>
                    <div class="text-sm text-gray-500">Uso: {{ quote.vehicleInfo.useType }}</div>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-500">
                    {{ new Date(quote.createdAt).toLocaleString() }}
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