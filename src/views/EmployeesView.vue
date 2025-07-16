<script setup lang="ts">
import { computed, ref } from 'vue'
import { useEmployeesStore } from '../stores/employees'
import SideNav from '../components/SideNav.vue'
import Header from '../components/Header.vue'
import type { User } from '../types'

type NewEmployee = Omit<User, 'id'>

const employeesStore = useEmployeesStore()

const showModal = ref(false)
const editingEmployee = ref<User | null>(null)
  const newEmployee = ref<NewEmployee>({
  email: '',
  name: '',
  role: 'employee',
  active: true
})

const openModal = (employee?: User) => {
  if (employee) {
    editingEmployee.value = employee
    newEmployee.value = {
      email: employee.email,
      name: employee.name,
      role: employee.role,
      active: employee.active
    }
  } else {
    editingEmployee.value = null
    newEmployee.value = {
      email: '',
      name: '',
      role: 'employee',
      active: true
    }
  }
  showModal.value = true
}

const emailError = ref('')
const nameError = ref('')

const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email.trim())
}

const isValidName = (name: string): boolean => {
  const regex = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]{3,}$/
  return regex.test(name.trim())
}

const toastMessage = ref('')
const showToast = ref(false)
const toastType = ref<'success' | 'error'>('success') 

const triggerToast = (message: string, type: 'success' | 'error' = 'success') => {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true

  setTimeout(() => {
    showToast.value = false
  }, 2000)
}

const handleSubmit = () => {
  const email = newEmployee.value.email.trim()
  const name = newEmployee.value.name.trim()

  let isValid = true

  if (!name) {
    nameError.value = 'El nombre es obligatorio.'
    isValid = false
  } else if (!isValidName(name)) {
    nameError.value = 'Ingrese un nombre válido.'
    isValid = false
  } else {
    nameError.value = ''
  }

  if (!email) {
    emailError.value = 'El correo electrónico es obligatorio.'
    isValid = false
  } else if (!isValidEmail(email)) {
    emailError.value = 'Ingrese un correo electrónico válido.'
    isValid = false
  } else {
    emailError.value = ''
  }

  if (!isValid) return

  if (editingEmployee.value) {
    employeesStore.updateEmployee(editingEmployee.value.id, newEmployee.value)
    triggerToast('Empleado actualizado con éxito', 'success')
  } else {
    employeesStore.addEmployee(newEmployee.value)
    triggerToast('Empleado creado con éxito', 'success')
  }

  showModal.value = false
}

const currentPage = ref(1)
const itemsPerPage = 7

const totalPages = computed(() =>
  Math.ceil(employeesStore.employees.length / itemsPerPage)
)

const paginatedEmployees = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return employeesStore.employees.slice(start, start + itemsPerPage)
})

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const handleDelete = (id: number) => {
  if (confirm('¿Está seguro de eliminar este empleado?')) {
    employeesStore.deleteEmployee(id)
    triggerToast('Empleado eliminado correctamente', 'error')

    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value || 1
    }
  }
}

</script>

<template>
  <SideNav>
    <Header>Empleados</Header>
    
    <main class="flex-1 overflow-y-auto bg-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
            <h2 class="text-lg font-semibold text-gray-900">Lista de Empleados</h2>
            <button
              @click="openModal()"
              class="px-4 py-2 text-sm text-white bg-primary rounded-md hover:bg-primary/90"
            >
              Nuevo Empleado
            </button>
          </div>
          
          <div class="border-t border-gray-200">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="employee in paginatedEmployees" :key="employee.id">
                  <td class="px-6 py-4 text-sm text-gray-900">{{ employee.name }}</td>
                  <td class="px-6 py-4 text-sm text-gray-500">{{ employee.email }}</td>
                  <td class="px-6 py-4">
                    <span
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="employee.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                    >
                      {{ employee.active ? 'Activo' : 'Inactivo' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm font-medium">
                    <button
                      @click="openModal(employee)"
                      class="text-primary hover:text-primary/80 mr-3"
                    >
                      Editar
                    </button>
                    <button
                      @click="handleDelete(employee.id)"
                      class="text-red-600 hover:text-red-900"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div v-if="totalPages > 1" class="flex justify-center mt-4 items-center gap-2 flex-wrap">
              <button
                @click="goToPage(currentPage - 1)"
                :disabled="currentPage === 1"
                class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                v-for="page in totalPages"
                :key="page"
                @click="goToPage(page)"
                :class="[
                  'px-3 py-1 rounded',
                  page === currentPage
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                ]"
              >
                {{ page }}
              </button>

              <button
                @click="goToPage(currentPage + 1)"
                :disabled="currentPage === totalPages"
                class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
      </div>
    </main>

    <!-- Modal -->
    <Transition name="fade">
      <div v-if="showModal" class="fixed z-10 inset-0 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form @submit.prevent="handleSubmit">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">
                {{ editingEmployee ? 'Editar' : 'Nuevo' }} Empleado
              </h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Nombre</label>
                  <input
                    type="text"
                    v-model="newEmployee.name"
                    :class="[
                      'mt-1 block w-full px-2 py-1 rounded-md shadow-sm focus:ring focus:ring-primary focus:ring-opacity-50',
                      nameError ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-primary'
                    ]"
                  />
                  <p v-if="nameError" class="text-sm text-red-600 mt-1">{{ nameError }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="text"
                    v-model="newEmployee.email"
                    :class="[
                      'mt-1 block w-full px-2 py-1 rounded-md shadow-sm focus:ring focus:ring-primary focus:ring-opacity-50',
                      emailError ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-primary'
                    ]"
                  />
                  <p v-if="emailError" class="text-sm text-red-600 mt-1">{{ emailError }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Estado</label>
                  <select
                    v-model="newEmployee.active"
                    class="mt-1 block w-full px-2 py-1 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  >
                    <option :value="true">Activo</option>
                    <option :value="false">Inactivo</option>
                  </select>
                </div>
              </div>

            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm"
              >
                {{ editingEmployee ? 'Actualizar' : 'Crear' }}
              </button>
              <button
                type="button"
                @click="showModal = false"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </Transition>
    <transition name="fade">
      <div
        v-if="showToast"
        :class="[
          'fixed bottom-7 right-7 p-4 rounded shadow-lg z-50 font-semibold',
          toastType === 'success' ? 'bg-green-200 text-green-700' : 'bg-red-500 text-white'
        ]"
      >
      {{ toastMessage }}
    </div>
  </transition>
  </SideNav>
</template>


<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
