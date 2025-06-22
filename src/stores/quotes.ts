import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

// --- INTERFAZ ACTUALIZADA ---
// La interfaz ahora incluye TODOS los campos posibles de una cotización,
// desde el lead inicial hasta la póliza finalizada.
export interface ApiQuote {
  _id: string
  // Datos del lead
  document: string
  phone: string
  plate?: string
  hasPlate: boolean
  brand: string
  model: string
  year: number
  usage: string
  // Datos que el asesor completa
  nombre?: string
  email?: string
  fechaNacimiento?: string
  distrito?: string
  // Datos de la Póliza y Cálculo
  sumaAsegurada: number
  montoPrima: number
  deducible: number
  coberturasAdicionales?: {
    asistenciaElectricos: boolean
    coberturaBateria: boolean
    danoEstacionCarga: boolean
    riesgoCibernetico: boolean
  }
  internalNotes?: string
  // Metadatos
  status: 'lead' | 'pending' | 'approved' | 'rejected'
  createdAt: string
  updatedAt: string
}

// Interfaz para la respuesta de la API de una sola cotización
interface ApiSingleResponse {
  success: boolean
  message: string
  data: ApiQuote
}

// Interfaz para la respuesta de la API de la lista de cotizaciones
interface ApiListResponse {
  success: boolean
  message: string
  data: ApiQuote[]
}

// --- URL BASE DE TU BACKEND DE NODE.JS ---
const API_BASE_URL = 'http://localhost:9999/api/1.0/' // ¡Importante! Usa el puerto de tu backend de Node.js

export const useQuotesStore = defineStore('quotes', () => {
  // --- STATE ---
  const quotes = ref<ApiQuote[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // --- ACCIONES ---

  /**
   * Acción para obtener TODAS las cotizaciones (leads, pendientes, etc.)
   */
  const fetchQuotes = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await axios.get<ApiListResponse>(`${API_BASE_URL}/quotes`)
      if (response.data && response.data.success) {
        quotes.value = response.data.data
      } else {
        throw new Error(response.data.message || 'Error al obtener las cotizaciones.')
      }
    } catch (err) {
      handleAxiosError(err, 'Ocurrió un error al obtener las cotizaciones.')
    } finally {
      loading.value = false
    }
  }

  /**
   * ACCIÓN CLAVE: Actualiza y recalcula la cotización desde el portal de ventas.
   * Es llamada por la vista ManageQuote.vue.
   */
  const updateAndRecalculateQuote = async (id: string, payload: any) => {
    loading.value = true
    error.value = null
    try {
      const response = await axios.put<ApiSingleResponse>(`${API_BASE_URL}/quotes/${id}`, payload)
      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      
      // Actualizamos la cotización en nuestro listado local para que la UI reaccione
      const index = quotes.value.findIndex(q => q._id === id)
      if (index !== -1) {
        quotes.value[index] = response.data.data
      }
      
      return response.data.data // Devolvemos la cotización actualizada
    } catch (err) {
      handleAxiosError(err, 'Ocurrió un error al actualizar la cotización.')
      throw err // Relanzamos el error para que el componente lo pueda atrapar si es necesario
    } finally {
      loading.value = false
    }
  }
  
  /**
   * ACCIÓN FINAL: Cambia el estado de la venta (aprobar/rechazar).
   */
  const updateQuoteStatus = async (id: string, newStatus: 'approved' | 'rejected') => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.patch<ApiSingleResponse>(`${API_BASE_URL}/quotes/${id}/status`, { status: newStatus });
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      const index = quotes.value.findIndex(q => q._id === id);
      if (index !== -1) {
        quotes.value[index].status = response.data.data.status;
        quotes.value[index].updatedAt = response.data.data.updatedAt;
      }
      return response.data.data;
    } catch (err) {
      handleAxiosError(err, 'Ocurrió un error al cambiar el estado.');
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // --- Helper para manejar errores de Axios ---
  const handleAxiosError = (err: any, defaultMessage: string) => {
    if (axios.isAxiosError(err)) {
      error.value = err.response?.data?.message || err.message || defaultMessage
    } else {
      error.value = 'Ocurrió un error desconocido.'
    }
    console.error(error.value)
  }

  return {
    quotes,
    loading,
    error,
    fetchQuotes,
    updateAndRecalculateQuote,
    updateQuoteStatus,
  }
})