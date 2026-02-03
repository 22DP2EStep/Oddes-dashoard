<template>
  <div class="app-layout">
    <!-- Navigation -->
    <nav>
      <div class="container nav-container">
        <div>
          <h1>Dashboard</h1>
        </div>
        <div class="nav-links">
          <RouterLink 
            to="/" 
            :class="{ 'active': $route.path === '/' }"
          >
            Overview
          </RouterLink>
          <RouterLink 
            to="/data" 
            :class="{ 'active': $route.path === '/data' }"
          >
            Data Table
          </RouterLink>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main>
      <div class="container">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
}
</style>