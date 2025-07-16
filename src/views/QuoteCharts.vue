<script setup lang="ts">
import { Pie, Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js'
import { computed, ref } from 'vue'
import { Line } from 'vue-chartjs'
import { LineElement, PointElement } from 'chart.js'
import { useQuotesStore } from '../stores/quotes'

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement,LineElement, PointElement)

const quotesStore = useQuotesStore()

// Datos simulados de cotizaciones
const mockQuotes = ref([
  { vehicle: { model: 'Tesla Model 3', brand: 'Tesla' }, date: '2025-06-22' },
  { vehicle: { model: 'BYD Dolphin', brand: 'BYD' }, date: '2025-06-22' },
  { vehicle: { model: 'Nissan Leaf', brand: 'Nissan' }, date: '2025-06-23' },
  { vehicle: { model: 'Tesla Model 3', brand: 'Tesla' }, date: '2025-06-23' },
  { vehicle: { model: 'Kia EV6', brand: 'Kia' }, date: '2025-06-23' },
  { vehicle: { model: 'BYD Dolphin', brand: 'BYD' }, date: '2025-06-24' },
  { vehicle: { model: 'Tesla Model 3', brand: 'Tesla' }, date: '2025-06-24' },
  { vehicle: { model: 'MG 4', brand: 'MG' }, date: '2025-06-25' },
  { vehicle: { model: 'Cupra Born', brand: 'Cupra' }, date: '2025-06-25' },
  { vehicle: { model: 'Kia EV6', brand: 'Kia' }, date: '2025-06-25' },
  { vehicle: { model: 'Kia EV6', brand: 'Kia' }, date: '2025-06-25' },
  { vehicle: { model: 'Cupra Born', brand: 'Cupra' }, date: '2025-06-26' },
])


// Cotizaciones por estado
const statusChartData = computed(() => {
  const statusCounts: Record<string, number> = {
    activas: 20,
    pendientes: 10,
    canceladas: 5
  }

  quotesStore.quotes.forEach(quote => {
    statusCounts[quote.status] = (statusCounts[quote.status] || 0) + 1
  })

  return {
    labels: ['Activas', 'Pendientes', 'Canceladas'],
    datasets: [
      {
        label: 'Estado de Cotizaciones',
        backgroundColor: ['#10b981', '#facc15', '#ef4444'],
        data: [statusCounts.activas, statusCounts.pendientes, statusCounts.canceladas]
      }
    ]
  }
})

const quotesOverTimeData = computed(() => {
  const dateCounts: Record<string, number> = {}

  mockQuotes.value.forEach(quote => {
    const date = quote.date || 'Sin fecha'
    dateCounts[date] = (dateCounts[date] || 0) + 1
  })

  const sortedDates = Object.keys(dateCounts).sort()

  return {
    labels: sortedDates,
    datasets: [
      {
        label: 'Cotizaciones por Fecha',
        borderColor: '#10b981',
        backgroundColor: '#d1fae5',
        fill: true,
        tension: 0.3,
        data: sortedDates.map(date => dateCounts[date])
      }
    ]
  }
})


// Procesar datos para el gráfico
const topVehiclesData = computed(() => {
  const vehicleCounts: Record<string, number> = {}

  mockQuotes.value.forEach(quote => {
    const model = quote.vehicle?.model || 'Desconocido'
    vehicleCounts[model] = (vehicleCounts[model] || 0) + 1
  })

  return {
    labels: Object.keys(vehicleCounts),
    datasets: [
      {
        label: 'Vehículos más cotizados',
        backgroundColor: '#3b82f6',
        data: Object.values(vehicleCounts)
      }
    ]
  }
})

// Chart options
const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'right'
    },
    tooltip: {
      callbacks: {
        label: (context: any) => {
          const label = context.label || ''
          const value = context.parsed || 0
          return `${label}: ${value}`
        }
      }
    }
  }
}

const chartOptionsHorizontal = {
  ...chartOptions,
  indexAxis: 'y'
}

// Marcas más cotizadas
const topBrandsData = computed(() => {
  const brandCounts: Record<string, number> = {}

  mockQuotes.value.forEach(quote => {
    const brand = quote.vehicle?.brand || 'Desconocido'
    brandCounts[brand] = (brandCounts[brand] || 0) + 1
  })

  return {
    labels: Object.keys(brandCounts),
    datasets: [
      {
        label: 'Marcas más cotizadas',
        backgroundColor: '#ec4899',
        data: Object.values(brandCounts)
      }
    ]
  }
})

</script>

<template>
  <div class="grid grid-cols-4 md:grid-cols-2 gap-6 mt-8">
    <div class="bg-white p-4 rounded shadow md:col-span-2">
  <h2 class="text-lg font-semibold mb-4">Evolución de Cotizaciones</h2>
  <Line :data="quotesOverTimeData" />
</div>
<div class="bg-white grid-cols-1 p-4 rounded shadow" style="width: 150%;">
      <h2 class="text-lg font-semibold mb-4">Cotizaciones por estado</h2>
      <Pie :data="statusChartData" />
    </div>
  </div>
  <div class="grid grid-cols-4 md:grid-cols-1 gap-6 mt-8">
    <div class="bg-white p-4 rounded shadow">
      <h2 class="text-lg font-semibold mb-4">Vehículos más Cotizados</h2>
      <Bar :data="topVehiclesData" />
    </div>
    <div class="bg-white p-4 rounded shadow md:col-span-2">
      <h2 class="text-lg font-semibold mb-4">Marcas más Cotizadas</h2>
      <Bar :data="topBrandsData" :options="chartOptionsHorizontal"/>
    </div>
  </div>
  
</template>
