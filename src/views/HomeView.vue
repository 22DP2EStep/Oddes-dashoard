<template>
  <div class="dashboard">
    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading dashboard data...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <h3>⚠️ Configuration Needed</h3>
      <p>{{ error }}</p>
      <div class="config-help">
        <h4>To connect your Supabase table:</h4>
        <ol>
          <li>Update the <code>TABLE_CONFIG</code> in HomeView.vue</li>
          <li>Set your table name and column names</li>
          <li>Add your Supabase credentials to .env.local</li>
        </ol>
      </div>
    </div>

    <!-- Dashboard Content -->
    <div v-else>
      <!-- Time Interval Controls -->
      <div class="dashboard-controls">
        <button class="control-btn" @click="changeTimeInterval">
          {{ timeInterval }} <span class="refresh-icon">🔄</span>
        </button>
      </div>

    <!-- Top Metrics Row -->
    <div class="top-metrics-row">
      <div class="metric-card">
        <h3># of Call Initiated</h3>
        <div class="metric-value">{{ metrics.callsInitiated }}</div>
        <div class="metric-change" :class="getChangeClass(metrics.callsInitiatedChange)">
          {{ formatChange(metrics.callsInitiatedChange) }}
        </div>
      </div>
      <div class="metric-card">
        <h3>Pick Up Rate %</h3>
        <div class="metric-value">{{ metrics.pickUpRate }}%</div>
        <div class="metric-change" :class="getChangeClass(metrics.pickUpRateChange)">
          {{ formatChange(metrics.pickUpRateChange) }}
        </div>
      </div>
      <div class="metric-card">
        <h3>Booking Rate %</h3>
        <div class="metric-value">{{ metrics.bookingRate }}%</div>
        <div class="metric-change" :class="getChangeClass(metrics.bookingRateChange)">
          {{ formatChange(metrics.bookingRateChange) }}
        </div>
      </div>
      <div class="metric-card">
        <h3>Cost Per Booking</h3>
        <div class="metric-value">${{ metrics.costPerBooking }}</div>
        <div class="metric-change" :class="getChangeClass(metrics.costPerBookingChange)">
          {{ formatChange(metrics.costPerBookingChange) }}
        </div>
      </div>
      <div class="metric-card">
        <h3>Average Cost Per Call</h3>
        <div class="metric-value">${{ metrics.avgCostPerCall }}</div>
        <div class="metric-change" :class="getChangeClass(metrics.avgCostPerCallChange)">
          {{ formatChange(metrics.avgCostPerCallChange) }}
        </div>
      </div>
    </div>

    <!-- Main Dashboard Layout -->
    <div class="main-dashboard-layout">
      <!-- Side Metrics (Left Column) -->
      <div class="side-metrics">
        <div class="metric-card">
          <h3># of Calls Picked Up</h3>
          <div class="metric-value">{{ metrics.callsPickedUp }}</div>
        </div>
        <div class="metric-card">
          <h3># of Meetings Booked</h3>
          <div class="metric-value">{{ metrics.meetingsBooked }}</div>
        </div>
        <div class="metric-card">
          <h3>Money Spent</h3>
          <div class="metric-value">${{ metrics.moneySpent.toLocaleString() }}</div>
        </div>
      </div>

      <!-- Lead Pipeline (Right Column) -->
      <div class="pipeline-section">
        <div class="pipeline-header">
          <h2>Lead Pipeline</h2>
          <button class="sort-btn" @click="sortPipelineByValue">
            Sort by Value {{ sortDirection === 'desc' ? '↓' : '↑' }}
          </button>
        </div>
        <div class="pipeline-container">
          <div 
            v-for="(stage, index) in sortedPipelineStages" 
            :key="stage.name"
            class="pipeline-stage"
            :class="{ 'largest': index === 0 }"
          >
            <div class="stage-label">{{ stage.name }}</div>
            <div class="stage-value">{{ stage.value }}</div>
            <div class="stage-bar" :style="{ width: getStageWidth(stage.value) + '%' }"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="charts-section">
      <div class="chart-container">
        <ChartWidget
          title="Conversion Funnel"
          subtitle="Lead progression through stages"
          :data="funnelData"
          type="bar"
          :loading="chartsLoading"
          :error="chartsError"
        />
      </div>
      <div class="chart-container">
        <ChartWidget
          title="Weekly Performance Trend"
          subtitle="Leads & bookings over time"
          :data="trendData"
          type="line"
          :loading="chartsLoading"
          :error="chartsError"
        />
      </div>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { DataService } from '@/services/dataService'
import type { ChartData } from '@/services/dataService'
import ChartWidget from '@/components/ChartWidget.vue'

// Configuration - Update these values for your Supabase table
const TABLE_CONFIG = {
  tableName: import.meta.env.VITE_TABLE_NAME || 'your_table_name', // Replace with your actual table name
  columns: {
    value: 'value', // Column name that contains numeric values (for pipeline sorting)
    name: 'name', // Column name that contains names/titles
    status: 'status', // Column name that contains status information
    created_at: 'created_at' // Column name that contains creation timestamp
  }
}

// Reactive data for loading states
const loading = ref(true)
const error = ref<string | null>(null)
const rawData = ref<any[]>([])
const stats = ref<any>({})

// Reactive data for metrics
const metrics = ref({
  callsInitiated: 1250,
  callsInitiatedChange: 14.2,
  pickUpRate: 68.5,
  pickUpRateChange: -2.1,
  bookingRate: 24.3,
  bookingRateChange: 5.8,
  costPerBooking: 125,
  costPerBookingChange: -8.4,
  avgCostPerCall: 15.50,
  avgCostPerCallChange: 3.2,
  callsPickedUp: 856,
  meetingsBooked: 304,
  moneySpent: 19375
})

// Pipeline stages data - will be populated from Supabase
const pipelineStages = ref([
  { name: '# of Attempted Contact (#1, #2, #3)', value: 1250, status: 'Active' },
  { name: '# of Has Solar, Not Interested', value: 420, status: 'Inactive' },
  { name: '# of Has Solar, Has Batteries, Not Interested', value: 180, status: 'Pending' },
  { name: '# of Invalid Number', value: 95, status: 'Inactive' },
  { name: '# of Dead Lead', value: 75, status: 'Inactive' },
  { name: '# of Booked Meeting', value: 304, status: 'Active' }
])

const sortDirection = ref('desc')
const timeInterval = ref('7 days')

// Helper functions
const calculatePercentageChange = (current: number, previous: number): number => {
  if (!previous || previous === 0) return 0
  return Math.round(((current - previous) / previous) * 100 * 10) / 10
}

const formatNumber = (num: number): string => {
  return num.toLocaleString()
}

// Computed property for sorted pipeline stages
const sortedPipelineStages = computed(() => {
  const stages = [...pipelineStages.value]
  return stages.sort((a, b) => {
    return sortDirection.value === 'desc' ? b.value - a.value : a.value - b.value
  })
})

const trendData = ref({
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Inbound Leads',
      data: [65, 59, 80, 81, 56, 55, 60],
      borderColor: '#10B981',
      backgroundColor: 'rgba(16, 185, 129, 0.2)',
      borderWidth: 3,
      tension: 0.4,
      fill: true
    },
    {
      label: 'Meetings Booked',
      data: [28, 48, 40, 35, 25, 30, 32],
      borderColor: '#8B5CF6',
      backgroundColor: 'rgba(139, 92, 246, 0.2)',
      borderWidth: 3,
      tension: 0.4,
      fill: true
    },
    {
      label: 'Follow Outbounds',
      data: [35, 25, 45, 42, 38, 40, 35],
      borderColor: '#F59E0B',
      backgroundColor: 'rgba(245, 158, 11, 0.2)',
      borderWidth: 3,
      tension: 0.4,
      fill: true
    }
  ]
})

// Chart data
const funnelData = ref({
  labels: ['Opted-in', 'Qualified', 'Link Sent', 'Booked'],
  datasets: [{
    label: 'Lead Count',
    data: [420, 280, 145, 82],
    backgroundColor: [
      '#3B82F6',
      '#8B5CF6', 
      '#EC4899',
      '#10B981'
    ]
  }]
})

// Loading states
const chartsLoading = ref(false)
const chartsError = ref('')

// Methods
const changeTimeInterval = () => {
  const intervals = ['Today', '7 days', 'This month', '30 days', '12 months']
  const currentIndex = intervals.indexOf(timeInterval.value)
  const nextIndex = (currentIndex + 1) % intervals.length
  timeInterval.value = intervals[nextIndex] || '7 days'
  
  // Reload data for the new time interval
  loadDashboardData()
}

const sortPipelineByValue = () => {
  sortDirection.value = sortDirection.value === 'desc' ? 'asc' : 'desc'
}

const getStageWidth = (value: number): number => {
  const maxValue = Math.max(...pipelineStages.value.map(s => s.value))
  return (value / maxValue) * 100
}

const formatChange = (change: number): string => {
  const sign = change >= 0 ? '+' : ''
  return `${sign}${change}%`
}

const getChangeClass = (change: number): string => {
  return change >= 0 ? 'positive' : 'negative'
}

// Load dashboard data from Supabase
const loadDashboardData = async () => {
  try {
    loading.value = true
    error.value = null
    
    console.log(`Loading data for time interval: ${timeInterval.value}`)
    
    // Fetch statistics from your Supabase table
    const tableStats = await DataService.getStatistics(
      TABLE_CONFIG.tableName,
      TABLE_CONFIG.columns.value
    )
    
    // Fetch pipeline data (top records sorted by value)
    const pipeline = await DataService.getPipelineData(
      TABLE_CONFIG.tableName,
      TABLE_CONFIG.columns.value,
      TABLE_CONFIG.columns.name,
      10
    )
    
    // Update reactive data
    stats.value = tableStats
    rawData.value = pipeline
    
    // Update pipeline stages with real data
    if (pipeline.length > 0) {
      pipelineStages.value = pipeline.map((item, index) => ({
        name: item[TABLE_CONFIG.columns.name] || `Item ${index + 1}`,
        value: Number(item[TABLE_CONFIG.columns.value]) || 0,
        status: item[TABLE_CONFIG.columns.status] || 'Active'
      }))
    }
    
    // Update metrics based on real data
    if (tableStats.totalRecords > 0) {
      metrics.value.callsInitiated = tableStats.totalRecords
      metrics.value.callsPickedUp = tableStats.recentRecords || 0
      
      if (tableStats.totalValue) {
        metrics.value.moneySpent = Math.round(tableStats.totalValue)
      }
      
      if (tableStats.averageValue) {
        metrics.value.costPerBooking = Math.round(tableStats.averageValue)
        metrics.value.avgCostPerCall = Math.round(tableStats.averageValue * 0.1 * 100) / 100
      }
      
      // Calculate rates
      if (tableStats.totalRecords > 0) {
        const pickupRate = (tableStats.recentRecords / tableStats.totalRecords) * 100
        metrics.value.pickUpRate = Math.round(pickupRate * 10) / 10
      }
    }
    
    console.log('Dashboard data loaded:', { stats: tableStats, pipeline })
    
  } catch (err) {
    console.error('Error loading dashboard data:', err)
    error.value = 'Failed to load data from Supabase. Please check your table configuration.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadDashboardData()
})
</script>
