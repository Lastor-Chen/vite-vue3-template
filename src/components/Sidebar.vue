<script setup lang="ts">
const route = useRoute()
</script>

<template>
  <aside>
    <ElMenu class="h-full" :default-active="route.path" router>
      <ElMenuItem index="/dashboard">
        <span>Dashboard</span>
      </ElMenuItem>
      <ElMenuItem index="/ad-formats">
        <span>Ad Format</span>
      </ElMenuItem>
    </ElMenu>
  </aside>
</template>
