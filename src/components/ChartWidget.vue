<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div class="mb-4">
      <h3 class="chart-title">{{ title }}</h3>
      <p v-if="subtitle" class="chart-subtitle">{{ subtitle }}</p>
    </div>

    <div v-if="loading" class="h-64 flex items-center justify-center">
      <div class="animate-pulse">
        <div class="h-64 bg-gray-200 rounded"></div>
      </div>
    </div>

    <div v-else-if="error" class="h-64 flex items-center justify-center">
      <p class="text-red-600">Error loading chart: {{ error }}</p>
    </div>

    <div v-else class="chart-content">
      <component
        :is="chartComponent"
        :data="chartData"
        :options="chartOptions"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line, Doughnut, Pie } from "vue-chartjs";
import type { ChartData } from "@/services/dataService";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

interface Props {
  title: string;
  subtitle?: string;
  data: ChartData;
  type?: "bar" | "line" | "doughnut" | "pie";
  loading?: boolean;
  error?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: "bar",
  loading: false,
});

const chartComponent = computed(() => {
  switch (props.type) {
    case "line":
      return Line;
    case "doughnut":
      return Doughnut;
    case "pie":
      return Pie;
    default:
      return Bar;
  }
});

const chartData = computed(() => props.data);

const chartOptions = computed(() => {
  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 20,
        bottom: 20,
        left: 10,
        right: 10,
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#e2e8f0",
          font: {
            size: 13,
            weight: 500,
          },
          padding: 15,
          boxWidth: 12,
          boxHeight: 12,
        },
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.95)",
        titleColor: "#f1f5f9",
        bodyColor: "#e2e8f0",
        borderColor: "rgba(59, 130, 246, 0.5)",
        borderWidth: 1,
        titleFont: {
          size: 13,
        },
        bodyFont: {
          size: 12,
        },
      },
    },
  };

  if (props.type === "doughnut" || props.type === "pie") {
    return {
      ...baseOptions,
      plugins: {
        ...baseOptions.plugins,
        legend: {
          position: "right" as const,
          labels: {
            color: "#e2e8f0",
            font: {
              size: 12,
              weight: 500,
            },
            padding: 20,
          },
        },
      },
    };
  }

  return {
    ...baseOptions,
    scales: {
      x: {
        ticks: {
          color: "#94a3b8",
          font: {
            size: 12,
          },
          maxRotation: 0,
          padding: 10,
        },
        grid: {
          color: "rgba(51, 65, 85, 0.3)",
          drawBorder: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#94a3b8",
          font: {
            size: 12,
          },
          padding: 10,
        },
        grid: {
          color: "rgba(51, 65, 85, 0.3)",
          drawBorder: false,
        },
      },
    },
  };
});
</script>
