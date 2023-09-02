<script setup lang="ts">
const count = ref(0)
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink style="margin-left: 4px;" to="/about">About</RouterLink>
      </nav>
    </div>
  </header>
  <ElButton @click="count++">count: {{ count }}</ElButton>
  <RouterView />
</template>

<style scoped>
</style>
