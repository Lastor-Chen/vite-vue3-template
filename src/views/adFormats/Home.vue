<script setup lang="ts">
import EditForm from './EditForm.vue'
import { Edit as IconEdit } from '@element-plus/icons-vue'
import { getAdFormats } from '@/fetcher/adFormats'
import type { AdFormat, AdFormatEvent } from '@/fetcher/adFormats'

// table
const tableData = ref<AdFormat[]>([])

// init fetch table data
async function fetchTableData() {
  const { data, error } = await getAdFormats()
  if (!data) return console.log(error.data.message)

  console.log('GET tableData:\n', data.data.data)
  tableData.value = data.data.data
}
fetchTableData()

function event2String(event: AdFormatEvent) {
  const [key, value] = Object.entries(event)[0]
  return `${key}: ${value}`
}

// popup form
const eventForm = reactive({
  isShow: false,
  data: undefined as AdFormat | undefined,
  open(row: AdFormat) {
    this.data = row
    this.isShow = true
  },
  afterSubmit() {
    fetchTableData()
  }
})
</script>

<template>
  <ElTable :data="tableData" header-cell-class-name="!bg-gray-100" border>
    <ElTableColumn prop="id" label="ID" min-width="1" />
    <ElTableColumn prop="name" label="Name" min-width="3" />
    <ElTableColumn prop="events" label="Events" min-width="3">
      <template #default="{ row }: { row: AdFormat }">
        <div v-for="(event, idx) in row.events" :key="`end${idx}`">
          {{ event2String(event) }}
        </div>
      </template>
    </ElTableColumn>
    <ElTableColumn label="Actions" min-width="1">
      <template #default="{ row }: { row: AdFormat }">
        <ElButton type="success" :icon="IconEdit" @click="eventForm.open(row)" />
      </template>
    </ElTableColumn>
  </ElTable>
  <EditForm
    v-model:show="eventForm.isShow"
    :init-data="eventForm.data"
    @after-submit="eventForm.afterSubmit"
  />
</template>
