<script setup lang="ts">
import EditForm from './EditForm.vue'
import { Edit as IconEdit } from '@element-plus/icons-vue'
import type { AdFormat } from './type.d'

// table
const dummy: AdFormat[] = Array.from({ length: 10 }, (_, idx) => ({
  id: idx + 1,
  name: `Ad Format ${idx + 1}`,
  events: idx !== 0 ? [] : [
    { action: 'click', label: '點擊' },
    { action: 'swipe_left', label: '左滑' },
    { action: 'swipe_right', label: '右滑' },
  ],
}))
const tableData = ref(dummy)

// popup form
const eventForm = reactive({
  isShow: false,
  data: undefined as AdFormat | undefined,
  open(row: AdFormat) {
    this.data = row
    this.isShow = true
  },
})
</script>

<template>
  <ElTable :data="tableData" header-cell-class-name="!bg-gray-100" border>
    <ElTableColumn prop="id" label="ID" min-width="1" />
    <ElTableColumn prop="name" label="Name" min-width="3" />
    <ElTableColumn prop="events" label="Events" min-width="3">
      <template #default="{ row }: { row: AdFormat }">
        <div v-for="(event, idx) in row.events" :key="`end${idx}`">
          {{ event.action }}: {{ event.label }}
        </div>
      </template>
    </ElTableColumn>
    <ElTableColumn label="Actions" min-width="1">
      <template #default="{ row }: { row: AdFormat }">
        <ElButton type="success" :icon="IconEdit" @click="eventForm.open(row)" />
      </template>
    </ElTableColumn>
  </ElTable>
  <EditForm v-model:show="eventForm.isShow" :init-data="eventForm.data" />
</template>
