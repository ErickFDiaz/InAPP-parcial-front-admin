import { defineStore } from 'pinia'
import { ref } from 'vue'

interface Quote {
  id: number
  clientInfo: {
    hasPlate: boolean
    plate?: string
    documentNumber: string
    phoneNumber: string
  }
  vehicleInfo: {
    year: number
    brand: string
    model: string
    useType: 'personal' | 'others'
  }
  createdAt: string
}

export const useQuotesStore = defineStore('quotes', () => {
  const quotes = ref<Quote[]>([
    {
      id: 1,
      clientInfo: {
        hasPlate: true,
        plate: 'ABC123',
        documentNumber: '12345678',
        phoneNumber: '999888777'
      },
      vehicleInfo: {
        year: 2022,
        brand: 'Toyota',
        model: 'Corolla',
        useType: 'personal'
      },
      createdAt: '2024-03-20T10:30:00'
    }
  ])

  const getQuotes = () => quotes.value

  return {
    quotes,
    getQuotes
  }
})