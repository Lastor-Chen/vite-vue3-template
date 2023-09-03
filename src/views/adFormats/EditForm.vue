<script setup lang="ts">
import {
  Close as IconClose,
  Plus as IconPlus,
  Warning as IconWarning,
} from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import { putAdFormat } from '@/fetcher/adFormats'
import type { AdFormat } from '@/fetcher/adFormats'

const props = defineProps({
  show: Boolean,
  initData: {
    type: Object as PropType<AdFormat>,
    default: () => ({}),
  },
})
const emit = defineEmits(['update:show', 'after-submit'])

const form = ref<FormInstance | null>(null)
const formState = reactive({
  events: [{ key: '', value: '' }],
  get initRow() {
    return { key: '', value: '' }
  },
  addRow() {
    this.events.push(this.initRow)
  },
  removeRow(index: number) {
    if (this.events.length <= 1) return
    this.events.splice(index, 1)
  },
  reset() {
    this.events = [this.initRow]
  },
})

// sync initData to formState
watch(() => props.show, (isShow) => {
  if (!isShow) return

  const events = props.initData.events
  if (!events.length) return formState.reset()

  formState.events = events.map((event) => {
    const [key, value] = Object.entries(event)[0]
    return { key, value }
  })
})

async function submit() {
  if (!form.value) return
  if (!props.initData) return

  const valid = await form.value.validate().catch(() => false)
  if (!valid) return

  // transform into request body
  const events: AdFormat['events'] = []
  formState.events.forEach((event) => {
    if (!event.key || !event.value) return
    events.push({ [event.key]: event.value })
  })

  console.log('Submit request:\n', {
    id: props.initData.id,
    body: { events },
  })
  const { data, error } = await putAdFormat(props.initData.id, {
    events,
  })

  if (data) {
    // update parent table data
    const payload = data.data.data
    console.log('Submit response:\n', payload)
    emit('after-submit', payload)

    ElMessage({
      message: '更新成功',
      type: 'success',
    })
  } else {
    console.log(error.data.message)
  }

  closeDialog()
}

function closeDialog() {
  form.value?.clearValidate()
  emit('update:show', false)
}

/**
 * 檢查單項未填寫, 都填 or 都未填皆為通過
 */
function validDoubleRequired(rule: object, row: { key: string, value: string }, cb: (error?: Error) => any) {
  const { key, value } = row
  const isNotAllInputted = (key && !value) || (!key && value)
  if (isNotAllInputted) return cb(new Error('必須兩項都填寫'))
  cb()
}

// 輔助驗證用, 防無限迴圈
let isDuplicatesError = false

/**
 * 檢查 key 不得重複
 */
function validDuplicateKeys(rule: object, row: { key: string, value: string }, cb: (error?: Error) => any) {
  if (!form.value) return

  if (row.key) {
    // 計算重複
    let count = 0
    const hasDuplicates = formState.events.some(item => {
      if (item.key === row.key) {
        count++
      }
      if (count > 1) return true
    })

    if (hasDuplicates) {
      isDuplicatesError = true
      return cb(new Error(`${row.key} 已存在`))
    }
    // 觸發再驗證, 以清除其他 item 的 error style
    if (isDuplicatesError) {
      isDuplicatesError = false
      void form.value.validate().catch(() => void 0)
    }
  }
  cb()
}
</script>

<template>
  <ElDialog
    :modelValue="show"
    :title="initData?.name"
    :before-close="closeDialog"
  >
    <div class="grid grid-cols-[4.5fr_4.5fr_1fr] items-end gap-x-2" style="margin-bottom: 8px; font-size: 16px">
      <div class="flex items-center space-x-1">
        <span>Event Action</span>
        <ElTooltip
          effect="dark"
          content="定義事件 key"
          placement="top"
        >
          <ElIcon>
            <IconWarning />
          </ElIcon>
        </ElTooltip>
      </div>
      <div class="flex items-center space-x-1">
        <span>Event Label</span>
        <ElTooltip
          effect="dark"
          content="定義事件名稱"
          placement="top"
        >
          <ElIcon>
            <IconWarning />
          </ElIcon>
        </ElTooltip>
      </div>
    </div>

    <ElForm ref="form" :model="formState">
      <template v-for="(event, idx) in formState.events" :key="idx">
        <ElFormItem
          :prop="`events.${idx}`"
          :rules="[
            {
              validator: validDuplicateKeys,
              trigger: 'blur',
            },
            {
              validator: validDoubleRequired,
              trigger: 'blur',
            },
          ]"
        >
          <div class="grid grid-cols-[4.5fr_4.5fr_1fr] items-stretch gap-x-2 w-full">
            <ElInput v-model="event.key" />
            <ElInput v-model="event.value" />
            <div>
              <ElButton
                class="!h-full"
                type="danger"
                :icon="IconClose"
                plain
                @click="() => formState.removeRow(idx)"
              />
            </div>
          </div>
        </ElFormItem>
      </template>
      <div>
        <ElButton
          type="primary"
          :icon="IconPlus"
          plain
          @click="() => formState.addRow()"
        />
      </div>
    </ElForm>

    <template #footer>
      <div class="dialog-footer">
        <ElButton @click="closeDialog">取消</ElButton>
        <ElButton type="primary" @click="() => submit()">儲存</ElButton>
      </div>
    </template>
  </ElDialog>
</template>
