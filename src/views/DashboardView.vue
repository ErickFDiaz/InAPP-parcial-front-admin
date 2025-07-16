<script setup lang="ts">
import { ref, onMounted, watchEffect } from 'vue'
import { useQuotesStore } from '../stores/quotes'
import SideNav from '../components/SideNav.vue'
import Header from '../components/Header.vue'
import type { DashboardMetrics } from '../types'
// Assuming you are using Heroicons, adjust path if necessary
import { DocumentTextIcon, ClockIcon } from '@heroicons/vue/24/outline'
import QuoteCharts from '../views/QuoteCharts.vue'

const quotesStore = useQuotesStore()

const metrics = ref<DashboardMetrics>({
  totalQuotes: 0,
  todayQuotes: 0,
  personalUsePercentage: 0,
  othersUsePercentage: 0
})

const calculateMetrics = () => {
  const quotes = quotesStore.quotes

  if (!quotes || quotes.length === 0) {
    metrics.value = {
      totalQuotes: 0,
      todayQuotes: 0,
      personalUsePercentage: 0,
      othersUsePercentage: 0
    }
    return
  }

  metrics.value.totalQuotes = quotes.length
  
  const today = new Date().toISOString().split('T')[0]
  metrics.value.todayQuotes = quotes.filter(q => 
    q.createdAt.startsWith(today)
  ).length

  const personalUse = quotes.filter(q => q.usage === 'personal').length // Corrected property
  
  if (quotes.length > 0) {
    metrics.value.personalUsePercentage = (personalUse / quotes.length) * 100
    metrics.value.othersUsePercentage = 100 - metrics.value.personalUsePercentage
  } else {
    metrics.value.personalUsePercentage = 0
    metrics.value.othersUsePercentage = 0
  }
}

onMounted(async () => {
  // Fetch quotes only if they are not already loaded and not currently loading
  if (quotesStore.quotes.length === 0 && !quotesStore.loading) {
    await quotesStore.fetchQuotes()
  }
  // Initial calculation will be handled by watchEffect after data is available
})

watchEffect(() => {
  // Recalculate metrics when quotes data changes, or after loading finishes
  if (!quotesStore.loading && !quotesStore.error) {
    calculateMetrics()
  }
})
</script>

<template>
  <SideNav>
    <Header>Dashboard</Header>
    
    <main class="flex-1 overflow-y-auto bg-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <!-- Total Quotes -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <DocumentTextIcon class="h-6 w-6 text-gray-400" />
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">
                      Total Cotizaciones
                    </dt>
                    <dd class="flex items-baseline">
                      <div class="text-2xl font-semibold text-gray-900">
                        {{ metrics.totalQuotes }}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <!-- Today's Quotes -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <ClockIcon class="h-6 w-6 text-gray-400" />
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">
                      Cotizaciones Hoy
                    </dt>
                    <dd class="flex items-baseline">
                      <div class="text-2xl font-semibold text-gray-900">
                        {{ metrics.todayQuotes }}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <!-- Personal Use -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">
                      Uso Personal
                    </dt>
                    <dd class="flex items-baseline">
                      <div class="text-2xl font-semibold text-gray-900">
                        {{ metrics.personalUsePercentage.toFixed(1) }}%
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <!-- Other Uses -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">
                      Otros Usos
                    </dt>
                    <dd class="flex items-baseline">
                      <div class="text-2xl font-semibold text-gray-900">
                        {{ metrics.othersUsePercentage.toFixed(1) }}%
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
        <QuoteCharts/></div>
      </div>
    </main>
  </SideNav>
</template>