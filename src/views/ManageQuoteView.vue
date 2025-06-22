<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuotesStore, type ApiQuote } from '../stores/quotes'
import SideNav from '../components/SideNav.vue'
import Header from '../components/Header.vue'

// Esta interfaz define los campos que el asesor puede modificar
interface ManageableQuoteData {
  // Campos a completar para el recálculo
  fechaNacimiento: string
  distrito: string
  deducible: number
  coberturasAdicionales: {
    asistenciaElectricos: boolean
    coberturaBateria: boolean
    danoEstacionCarga: boolean
    riesgoCibernetico: boolean
  }
  // Campos adicionales de la póliza
  status: 'lead' | 'pending' | 'approved' | 'rejected'
  rejectionReason?: string
  internalNotes: string
}

const route = useRoute()
const router = useRouter()
const quotesStore = useQuotesStore()

const quoteId = computed(() => route.params.id as string)
const quote = ref<ApiQuote | null>(null)

// El estado del formulario ahora se alinea con la lógica de recálculo
const formData = ref<ManageableQuoteData>({
  fechaNacimiento: '',
  distrito: '',
  deducible: 500,
  coberturasAdicionales: {
    asistenciaElectricos: false,
    coberturaBateria: false,
    danoEstacionCarga: false,
    riesgoCibernetico: false,
  },
  status: 'pending',
  rejectionReason: '',
  internalNotes: '',
})

const loading = ref(true)
const error = ref<string | null>(null)

// Opciones para los desplegables del formulario
const distritosDeLima = ["Miraflores", "San Isidro", "San Borja", "Jesús María", "Lince", "Comas", "San Juan de Lurigancho", "Callao", "Ate", "La Molina"];

// Cargamos los datos de la cotización al montar el componente
onMounted(async () => {
  // Si las cotizaciones no están cargadas, las cargamos primero
  if (quotesStore.quotes.length === 0) {
    await quotesStore.fetchQuotes()
  }
  // Buscamos la cotización en el store
  const foundQuote = quotesStore.quotes.find(q => q._id === quoteId.value)
  if (foundQuote) {
    quote.value = foundQuote
    // Pre-populamos el formulario con los datos existentes
    formData.value.status = foundQuote.status;
    formData.value.deducible = foundQuote.deducible;
    // Si la data ya fue completada antes, la mostramos
    formData.value.fechaNacimiento = foundQuote.fechaNacimiento ? new Date(foundQuote.fechaNacimiento).toISOString().split('T')[0] : '';
    formData.value.distrito = foundQuote.distrito || '';
    formData.value.coberturasAdicionales = foundQuote.coberturasAdicionales || formData.value.coberturasAdicionales;

  } else {
    error.value = 'Cotización no encontrada.'
  }
  loading.value = false
})

// El botón "Guardar Cambios" llama a esta función
const handleSubmit = async () => {
  if (!quote.value) return

  // Construimos el payload que espera el endpoint PUT /api/quotes/:id
  const payload = {
    ...formData.value, // Incluye fechaNacimiento, distrito, coberturas, etc.
    // También podemos pasar otros campos si es necesario
    document: quote.value.document, 
    phone: quote.value.phone
  }

  error.value = null;
  try {
    // Llamamos a la acción del store que hace la llamada PUT
    await quotesStore.updateAndRecalculateQuote(quote.value._id, payload);
    alert('¡Cotización actualizada y recalculada exitosamente!');
    router.push('/quotes'); // Volvemos a la lista
  } catch (e: any) {
    console.error("Error updating quote:", e);
    error.value = e.message || "Error al actualizar la cotización."
  }
}
</script>

<template>
  <SideNav>
    <Header>Gestionar Cotización {{ quoteId }}</Header>

    <main class="flex-1 overflow-y-auto bg-gray-100 p-8">
      <div v-if="loading">Cargando...</div>
      <div v-else-if="error" class="text-red-500">{{ error }}</div>
      
      <form v-else-if="quote" @submit.prevent="handleSubmit" class="bg-white shadow-md rounded-lg p-6 space-y-6 max-w-4xl mx-auto">
        <div>
          <h3 class="text-lg font-medium leading-6 text-gray-900">Información del Lead</h3>
          <div class="mt-4 grid grid-cols-1 gap-y-2 sm:grid-cols-3 sm:gap-x-4">
            <p><span class="font-semibold">Documento:</span> {{ quote.document }}</p>
            <p><span class="font-semibold">Teléfono:</span> {{ quote.phone }}</p>
            <p><span class="font-semibold">Vehículo:</span> {{ quote.brand }} {{ quote.model }} ({{ quote.year }})</p>
            <p><span class="font-semibold">Suma Asegurada:</span> ${{ quote.sumaAsegurada?.toLocaleString() }}</p>
            <p><span class="font-semibold">Prima (Preliminar):</span> ${{ quote.montoPrima?.toLocaleString() }}</p>
          </div>
        </div>
        <hr />

        <div>
          <h3 class="text-lg font-medium leading-6 text-gray-900">Completar Datos para Cálculo Final</h3>
          <div class="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
            <div>
              <label for="fechaNacimiento" class="block text-sm font-medium text-gray-700">Fecha Nacimiento Cliente</label>
              <input type="date" id="fechaNacimiento" v-model="formData.fechaNacimiento" required class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
            </div>
            <div>
              <label for="distrito" class="block text-sm font-medium text-gray-700">Distrito de Circulación</label>
              <select id="distrito" v-model="formData.distrito" required class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
                <option disabled value="">Seleccione un distrito</option>
                <option v-for="d in distritosDeLima" :key="d" :value="d">{{ d }}</option>
              </select>
            </div>
            <div>
               <label for="deductibleAmount" class="block text-sm font-medium text-gray-700">Monto Deducible (USD)</label>
               <input type="number" id="deductibleAmount" v-model.number="formData.deducible" required class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
            </div>
          </div>
        </div>

        <div>
            <h4 class="text-md font-medium text-gray-800">Coberturas Adicionales</h4>
            <div class="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="flex items-center">
                    <input id="asistenciaElectricos" v-model="formData.coberturasAdicionales.asistenciaElectricos" type="checkbox" class="h-4 w-4 text-emerald-600 border-gray-300 rounded">
                    <label for="asistenciaElectricos" class="ml-2 block text-sm text-gray-900">Asistencia para Eléctricos</label>
                </div>
                 <div class="flex items-center">
                    <input id="coberturaBateria" v-model="formData.coberturasAdicionales.coberturaBateria" type="checkbox" class="h-4 w-4 text-emerald-600 border-gray-300 rounded">
                    <label for="coberturaBateria" class="ml-2 block text-sm text-gray-900">Cobertura de Batería</label>
                </div>
                 <div class="flex items-center">
                    <input id="danoEstacionCarga" v-model="formData.coberturasAdicionales.danoEstacionCarga" type="checkbox" class="h-4 w-4 text-emerald-600 border-gray-300 rounded">
                    <label for="danoEstacionCarga" class="ml-2 block text-sm text-gray-900">Daño a Estación de Carga</label>
                </div>
                 <div class="flex items-center">
                    <input id="riesgoCibernetico" v-model="formData.coberturasAdicionales.riesgoCibernetico" type="checkbox" class="h-4 w-4 text-emerald-600 border-gray-300 rounded">
                    <label for="riesgoCibernetico" class="ml-2 block text-sm text-gray-900">Riesgo Cibernético</label>
                </div>
            </div>
        </div>
        <hr />
        
        <div>
            <h3 class="text-lg font-medium leading-6 text-gray-900">Gestión de la Venta</h3>
             <div class="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
                <div>
                  <label for="status" class="block text-sm font-medium text-gray-700">Actualizar Estado</label>
                  <select id="status" v-model="formData.status" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
                    <option value="lead" disabled>Lead</option>
                    <option value="pending">Pendiente</option>
                    <option value="approved">Aprobado</option>
                    <option value="rejected">Rechazado</option>
                  </select>
                </div>
             </div>
        </div>

        <div class="pt-5">
            <div class="flex justify-end">
                <button type="button" @click="router.push('/quotes')" class="px-4 py-2 text-sm font-medium rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200">Cancelar</button>
                <button type="submit" class="ml-3 px-4 py-2 text-sm font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700">Guardar y Recalcular</button>
            </div>
        </div>
      </form>
    </main>
  </SideNav>
</template>