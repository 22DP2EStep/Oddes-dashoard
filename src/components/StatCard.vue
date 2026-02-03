<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div class="flex items-center">
      <div class="flex-shrink-0">
        <component :is="icon" class="h-8 w-8 text-blue-600" />
      </div>
      <div class="ml-4">
        <p class="text-sm font-medium text-gray-500">{{ title }}</p>
        <p class="text-2xl font-semibold text-gray-900">{{ value }}</p>
        <p v-if="change" class="text-sm" :class="changeColor">
          {{ changeText }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title: string
  value: string | number
  icon: any
  change?: number
  changeType?: 'increase' | 'decrease'
}

const props = defineProps<Props>()

const changeColor = computed(() => {
  if (!props.change) return ''
  return props.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
})

const changeText = computed(() => {
  if (!props.change) return ''
  const sign = props.changeType === 'increase' ? '+' : '-'
  return `${sign}${Math.abs(props.change)}% from yesterday`
})
</script>