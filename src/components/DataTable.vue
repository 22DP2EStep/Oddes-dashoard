<template>
  <div class="bg-white rounded-lg shadow">
    <!-- Table Header -->
    <div class="px-6 py-4 border-b border-gray-200">
      <h3 class="text-lg font-medium text-gray-900">{{ title }}</h3>
      <p class="mt-1 text-sm text-gray-500">{{ subtitle }}</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="p-6">
      <div class="animate-pulse">
        <div class="space-y-3">
          <div class="h-4 bg-gray-200 rounded w-full"></div>
          <div class="h-4 bg-gray-200 rounded w-3/4"></div>
          <div class="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="p-6">
      <div class="text-red-600 text-center">
        <p>Error loading data: {{ error }}</p>
      </div>
    </div>

    <!-- Table -->
    <div v-else class="overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                v-for="column in columns"
                :key="column.key"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {{ column.label }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="item in data" :key="item.id" class="hover:bg-gray-50">
              <td
                v-for="column in columns"
                :key="`${item.id}-${column.key}`"
                class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
              >
                <slot :name="`cell-${column.key}`" :item="item" :value="item[column.key]">
                  {{ formatCellValue(item[column.key], column.type) }}
                </slot>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && data.length === 0" class="p-6 text-center">
        <p class="text-gray-500">No data available</p>
      </div>

      <!-- Pagination -->
      <div v-if="showPagination && totalCount > 0" class="px-6 py-3 border-t border-gray-200">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Showing {{ startRecord }} to {{ endRecord }} of {{ totalCount }} results
          </div>
          <div class="flex space-x-2">
            <button
              @click="$emit('page-change', currentPage - 1)"
              :disabled="currentPage === 0"
              class="px-3 py-1 text-sm bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
            >
              Previous
            </button>
            <button
              @click="$emit('page-change', currentPage + 1)"
              :disabled="endRecord >= totalCount"
              class="px-3 py-1 text-sm bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { DataItem } from '@/services/dataService'

interface Column {
  key: string
  label: string
  type?: 'text' | 'date' | 'number' | 'boolean'
}

interface Props {
  title: string
  subtitle?: string
  data: DataItem[]
  columns: Column[]
  loading?: boolean
  error?: string
  showPagination?: boolean
  currentPage?: number
  pageSize?: number
  totalCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  showPagination: false,
  currentPage: 0,
  pageSize: 10,
  totalCount: 0
})

const emit = defineEmits<{
  'page-change': [page: number]
}>()

const startRecord = computed(() => {
  return props.currentPage * props.pageSize + 1
})

const endRecord = computed(() => {
  return Math.min((props.currentPage + 1) * props.pageSize, props.totalCount)
})

const formatCellValue = (value: any, type: string = 'text'): string => {
  if (value === null || value === undefined) return '-'
  
  switch (type) {
    case 'date':
      return new Date(value).toLocaleDateString()
    case 'number':
      return typeof value === 'number' ? value.toLocaleString() : value
    case 'boolean':
      return value ? 'Yes' : 'No'
    default:
      return String(value)
  }
}
</script>