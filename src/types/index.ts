export interface User {
  id: number
  email: string
  name: string
  role: 'admin' | 'employee'
  active: boolean
}

export interface Quote {
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

export interface DashboardMetrics {
  totalQuotes: number
  todayQuotes: number
  personalUsePercentage: number
  othersUsePercentage: number
}