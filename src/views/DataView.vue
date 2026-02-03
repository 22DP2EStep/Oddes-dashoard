<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Data Table</h1>
        <p class="mt-1 text-gray-500">Complete view of your Supabase data</p>
      </div>
      <div class="flex space-x-3">
        <button
          @click="refreshData"
          :disabled="loading"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          <ArrowPathIcon
            v-if="loading"
            class="h-4 w-4 animate-spin inline mr-2"
          />
          <ArrowPathIcon v-else class="h-4 w-4 inline mr-2" />
          Refresh
        </button>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="bg-white rounded-lg shadow p-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Search</label
          >
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search data..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @input="debouncedSearch"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Page Size</label
          >
          <select
            v-model="pageSize"
            @change="handlePageSizeChange"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option :value="10">10 per page</option>
            <option :value="25">25 per page</option>
            <option :value="50">50 per page</option>
            <option :value="100">100 per page</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Total Records</label
          >
          <div
            class="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700"
          >
            {{ totalCount }} records
          </div>
        </div>
      </div>
    </div>

    <!-- Data Table -->
    <DataTable
      title="All Data"
      :subtitle="`Showing ${startRecord} to ${endRecord} of ${totalCount} records`"
      :data="data"
      :columns="tableColumns"
      :loading="loading"
      :error="error"
      :show-pagination="true"
      :current-page="currentPage"
      :page-size="pageSize"
      :total-count="totalCount"
      @page-change="handlePageChange"
    >
      <!-- Custom cell templates -->
      <template #cell-status="{ value }">
        <span
          class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
          :class="getStatusClass(value)"
        >
          {{ value }}
        </span>
      </template>

      <template #cell-created_at="{ value }">
        <div class="text-sm">
          <div>{{ formatDate(value) }}</div>
          <div class="text-gray-500">{{ formatTime(value) }}</div>
        </div>
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { DataService } from "@/services/dataService";
import type { DataItem } from "@/services/dataService";
import DataTable from "@/components/DataTable.vue";
import { ArrowPathIcon } from "@heroicons/vue/24/outline";
import { debounce } from "lodash-es";

// Configuration - Update these values for your Supabase table
const TABLE_NAME = "your_table_name"; // Replace with your actual table name

// Reactive data
const data = ref<DataItem[]>([]);
const loading = ref(true);
const error = ref("");
const currentPage = ref(0);
const pageSize = ref(10);
const totalCount = ref(0);
const searchQuery = ref("");

// Table columns configuration - Update these based on your table structure
const tableColumns = ref([
  { key: "id", label: "ID", type: "number" as const },
  { key: "created_at", label: "Created At", type: "date" as const },
  // Add more columns based on your table structure
  // { key: 'name', label: 'Name', type: 'text' as const },
  // { key: 'email', label: 'Email', type: 'text' as const },
  // { key: 'status', label: 'Status', type: 'text' as const },
  // { key: 'updated_at', label: 'Updated At', type: 'date' as const },
]);

// Computed properties
const startRecord = computed(() => {
  return currentPage.value * pageSize.value + 1;
});

const endRecord = computed(() => {
  return Math.min((currentPage.value + 1) * pageSize.value, totalCount.value);
});

// Methods
const loadData = async () => {
  loading.value = true;
  error.value = "";

  try {
    const result = await DataService.fetchPaginatedData(
      TABLE_NAME,
      currentPage.value,
      pageSize.value,
    );

    data.value = result.data;
    totalCount.value = result.count;
  } catch (err) {
    console.error("Error loading data:", err);
    error.value =
      "Failed to load data. Please check your Supabase configuration.";
  } finally {
    loading.value = false;
  }
};

const refreshData = () => {
  loadData();
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  loadData();
};

const handlePageSizeChange = () => {
  currentPage.value = 0; // Reset to first page
  loadData();
};

const debouncedSearch = debounce(() => {
  // TODO: Implement search functionality
  // You can extend the DataService to support search queries
  console.log("Search query:", searchQuery.value);
}, 300);

// Utility functions
const getStatusClass = (status: string) => {
  const statusClasses: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-red-100 text-red-800",
    pending: "bg-yellow-100 text-yellow-800",
    completed: "bg-blue-100 text-blue-800",
  };
  return statusClasses[status?.toLowerCase()] || "bg-gray-100 text-gray-800";
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString();
};

// Lifecycle
onMounted(() => {
  loadData();
});
</script>
