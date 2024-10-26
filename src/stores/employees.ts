import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '../types'

export const useEmployeesStore = defineStore('employees', () => {
  const employees = ref<User[]>([
    {
      id: 2,
      email: 'employee@electrysure.com',
      name: 'John Doe',
      role: 'employee',
      active: true
    }
  ])

  const addEmployee = (employee: Omit<User, 'id'>) => {
    const newId = Math.max(0, ...employees.value.map(e => e.id)) + 1
    employees.value.push({ ...employee, id: newId })
  }

  const updateEmployee = (id: number, data: Partial<User>) => {
    const index = employees.value.findIndex(e => e.id === id)
    if (index !== -1) {
      employees.value[index] = { ...employees.value[index], ...data }
    }
  }

  const deleteEmployee = (id: number) => {
    employees.value = employees.value.filter(e => e.id !== id)
  }

  const getEmployees = () => employees.value

  return {
    employees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployees
  }
})