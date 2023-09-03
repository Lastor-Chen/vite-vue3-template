<script setup lang="ts">
import {
  Close as IconClose,
  Plus as IconPlus,
  Warning as IconWarning,
} from '@element-plus/icons-vue'
import type { FormInstance, FormItemRule } from 'element-plus'
import { putAdFormat } from '@/fetcher/adFormats'
import type { AdFormat } from '@/fetcher/adFormats'

const props = defineProps({
  show: Boolean,
  initData: {
    type: Object as PropType<AdFormat>,
    default: () => ({}),
  },
})
const emit = defineEmits(['update:show', 'afterSubmit'])

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

  // format data
  formState.events = events.map((event) => {
    const [key, value] = Object.entries(event)[0]
    return { key, value }
  })
})

function closeDialog() {
  form.value?.clearValidate()
  emit('update:show', false)
}

// form submit
const isFetching = ref(false)

async function beforeSubmit() {
  if (isFetching.value) return

  const valid = await form.value?.validate().catch(() => false)
  if (!valid) return

  isFetching.value = true
  await submit()
  closeDialog()
  isFetching.value = false
}

async function submit() {
  // transform into request body
  const events: AdFormat['events'] = []
  formState.events.forEach((event) => {
    if (!event.key || !event.value) return
    events.push({ [event.key]: event.value })
  })

  // request
  console.log('Submit request:\n', { id: props.initData.id, body: { events } })
  const { data, error } = await putAdFormat(props.initData.id, {
    events,
  })
  if (error) return console.log(error.data.message)

  // update parent table data
  const payload = data.data.data
  console.log('Submit response:\n', payload)

  emit('afterSubmit', payload)
  ElMessage({
    message: '更新成功',
    type: 'success',
  })
}

/** 驗證單項未填寫, 都填 or 都未填皆為通過 */
const validDoubleRequired: FormItemRule['validator'] = (rule, row: typeof formState['initRow'], cb) => {
  const { key, value } = row
  const isNotAllInputted = (key && !value) || (!key && value)
  if (isNotAllInputted) return cb(new Error('必須兩項都填寫'))
  cb()
}

/** 驗證 key 不得重複 */
const validDuplicateKeys: FormItemRule['validator'] = (rule, row: typeof formState['initRow'], cb) => {
  if (row.key) {
    const msg = checkDuplicateKey(row.key)
    if (msg) return cb(new Error(msg))
  }
  cb()
}

/** 檢查輸入的 key 是否重複, 返回 string */
function checkDuplicateKey(key: string) {
  let count = 0
  const hasDuplicateKey = formState.events.some(item => {
    if (item.key === key) {
      count++
    }
    if (count > 1) return true
  })

  return hasDuplicateKey ? `${key} 已存在` : ''
}

// 取得驗證狀態
const isValid = ref(true)
const checkValid = () => {
  form.value?.validate((valid) => isValid.value = valid)
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

    <ElForm ref="form" :model="formState" @focusout="checkValid">
      <template v-for="(event, idx) in formState.events" :key="idx">
        <ElFormItem
          :prop="`events.${idx}`"
          :error="checkDuplicateKey(event.key)"
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
        <ElButton type="primary" v-loading="isFetching" :disabled="!isValid" @click="beforeSubmit">儲存</ElButton>
      </div>
    </template>
  </ElDialog>
</template>
