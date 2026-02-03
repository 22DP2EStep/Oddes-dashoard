import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database'

export interface DataItem {
  id: number
  [key: string]: any // This allows any column structure
}

// Add specific interfaces for your table columns
// Example for a leads/prospects table:
export interface LeadItem extends DataItem {
  name?: string
  email?: string
  phone?: string
  status?: string
  value?: number
  source?: string
  created_at?: string
  updated_at?: string
}

export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string | string[]
    borderColor?: string | string[]
    borderWidth?: number
    tension?: number
    fill?: boolean
  }[]
}

export class DataService {
  // Fetch all data from your table
  static async fetchTableData(tableName: string): Promise<DataItem[]> {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching data:', error)
      return []
    }
  }

  // Fetch data with pagination
  static async fetchPaginatedData(
    tableName: string, 
    page: number = 0, 
    limit: number = 10
  ): Promise<{ data: DataItem[], count: number }> {
    try {
      const { data, error, count } = await supabase
        .from(tableName)
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(page * limit, (page + 1) * limit - 1)

      if (error) throw error
      return { data: data || [], count: count || 0 }
    } catch (error) {
      console.error('Error fetching paginated data:', error)
      return { data: [], count: 0 }
    }
  }

  // Fetch data for charts
  static async fetchChartData(tableName: string, groupBy: string): Promise<ChartData> {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')

      if (error) throw error

      // Process data for charts
      const grouped = (data || []).reduce((acc, item) => {
        const key = item[groupBy] || 'Unknown'
        acc[key] = (acc[key] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      return {
        labels: Object.keys(grouped),
        datasets: [{
          label: `Count by ${groupBy}`,
          data: Object.values(grouped),
          backgroundColor: [
            '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
            '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6B7280'
          ]
        }]
      }
    } catch (error) {
      console.error('Error fetching chart data:', error)
      return { labels: [], datasets: [] }
    }
  }

  // Get summary statistics for dashboard metrics
  static async getStatistics(tableName: string, valueColumn?: string): Promise<{
    totalRecords: number
    recentRecords: number
    totalValue?: number
    averageValue?: number
    statusBreakdown?: Record<string, number>
  }> {
    try {
      // Get total count
      const { count: totalRecords } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true })

      // Get recent records (last 24 hours)
      const oneDayAgo = new Date()
      oneDayAgo.setDate(oneDayAgo.getDate() - 1)

      const { count: recentRecords } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true })
        .gte('created_at', oneDayAgo.toISOString())

      let totalValue, averageValue, statusBreakdown

      // Calculate value statistics if valueColumn provided
      if (valueColumn) {
        const { data: valueData } = await supabase
          .from(tableName)
          .select(valueColumn)
          .not(valueColumn, 'is', null)

        if (valueData && valueData.length > 0) {
          const values = valueData.map((item: any) => Number(item[valueColumn]) || 0)
          totalValue = values.reduce((sum, val) => sum + val, 0)
          averageValue = totalValue / values.length
        }
      }

      // Get status breakdown if status column exists
      const { data: statusData } = await supabase
        .from(tableName)
        .select('status')
        .not('status', 'is', null)

      if (statusData && statusData.length > 0) {
        statusBreakdown = statusData.reduce((acc: Record<string, number>, item) => {
          const status = item.status || 'Unknown'
          acc[status] = (acc[status] || 0) + 1
          return acc
        }, {})
      }

      return {
        totalRecords: totalRecords || 0,
        recentRecords: recentRecords || 0,
        totalValue,
        averageValue,
        statusBreakdown
      }
    } catch (error) {
      console.error('Error fetching statistics:', error)
      return {
        totalRecords: 0,
        recentRecords: 0
      }
    }
  }

  // Get data for pipeline (sorted by value)
  static async getPipelineData(
    tableName: string, 
    valueColumn: string, 
    nameColumn: string = 'name',
    limit: number = 10
  ): Promise<DataItem[]> {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .not(valueColumn, 'is', null)
        .order(valueColumn, { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching pipeline data:', error)
      return []
    }
  }
}