<script setup lang="ts">

const dummy = Array.from({ length: 10 }, (_, idx) => ({
  id: idx + 1,
  name: `Ad Format ${idx + 1}`,
  events: idx !== 0 ? [] : [
    { action: 'click', label: '點擊' },
    { action: 'swipe_left', label: '左滑' },
    { action: 'swipe_right', label: '右滑' },
  ],
}))

const tableData = ref(dummy)
</script>

<template>
  <ElTable :data="tableData" header-cell-class-name="!bg-gray-100" border>
    <ElTableColumn prop="id" label="ID" min-width="1" />
    <ElTableColumn prop="name" label="Name" min-width="3" />
    <ElTableColumn prop="events" label="Events" min-width="3">
      <template #default="{ row }: { row: typeof dummy[number] }">
        <div v-for="(event, idx) in row.events" :key="`end${idx}`">
          {{ event.action }}: {{ event.label }}
        </div>
      </template>
    </ElTableColumn>
    <ElTableColumn label="Actions" min-width="1">
      <template #default>
        <el-button type="success">Edit</el-button>
      </template>
    </ElTableColumn>
  </ElTable>
</template>
