<script setup lang="ts">
const count = ref(0)
</script>

<template>
  <header>
    <div>
      <nav class="space-x-2">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>
  <ElButton @click="count++">count: {{ count }}</ElButton>
  <RouterView />
</template>

<style scoped>
</style>
