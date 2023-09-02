<script setup lang="ts">
import {
  Close as IconClose,
  Plus as IconPlus,
} from '@element-plus/icons-vue'
import type { AdFormat } from './type.d'
import type { FormInstance } from 'element-plus'

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
  engList: [{ key: '', value: '' }],
  get initRow() {
    return { key: '', value: '' }
  },
  addRow() {
    this.engList.push(this.initRow)
  },
  removeRow(index: number) {
    if (this.engList.length <= 1) return
    this.engList.splice(index, 1)
  },
  reset() {
    this.engList = [this.initRow]
  },
})

// sync initData to formState
watch(() => props.show, (isShow) => {
  if (!isShow) return

  const events = props.initData.events
  if (!events.length) return formState.reset()

  formState.engList = events.map((eng) => {
    const [key, value] = Object.entries(eng)[0]
    return { key, value }
  })
})

async function submit() {
  if (!form.value) return
  if (!props.initData) return

  const valid = await form.value.validate().catch(err => err)
  if (!valid) return

  // transform into request body
  const definedEngList: AdFormat['events'] = []
  formState.engList.forEach(eng => {
    if (!eng.key || !eng.value) return
    definedEngList.push({ [eng.key]: eng.value })
  })

  // const res = await putAdFormatTypeEngList(props.initData.id, {
  //   defined_eng_list: definedEngList,
  // })
  const res = ''

  // update parent table data
  if (res) {
    emit('after-submit', res)
  }
  closeDialog()
}

function closeDialog() {
  form.value?.clearValidate()
  emit('update:show', false)
}

/**
 * 檢查單項未填寫, 都填 or 都未填皆為通過, 都未填時 submit 會濾掉
 */
function validDoubleRequired(rule: object, eng: { key: string, value: string }, cb: (error?: Error) => any) {
  const { key, value } = eng
  const isNotAllInputted = (key && !value) || (!key && value)
  if (isNotAllInputted) return cb(new Error('必須兩項都填寫'))
  cb()
}

// 輔助驗證用, 防無限迴圈
let isDuplicatesError = false

/**
 * 檢查 key 不得重複
 */
function validDuplicateKeys(rule: object, eng: { key: string, value: string }, cb: (error?: Error) => any) {
  if (!form.value) return

  if (eng.key) {
    // 計算重複
    let count = 0
    const hasDuplicates = formState.engList.some(item => {
      if (item.key === eng.key) {
        count++
      }
      if (count > 1) return true
    })

    if (hasDuplicates) {
      isDuplicatesError = true
      return cb(new Error(`eng 項目 ${eng.key} 已存在`))
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
      <div>
        <span>eng 項目</span>
        <ElTooltip
          effect="dark"
          content="請跟 MTO 取得 eng 參數"
          placement="top"
        >
          <i class="el-icon-warning-outline"></i>
        </ElTooltip>
      </div>
      <div>
        <span>eng 定義</span>
        <ElTooltip
          effect="dark"
          content="輸出於廣告成效報告項目"
          placement="top"
        >
          <i class="el-icon-warning-outline"></i>
        </ElTooltip>
      </div>
    </div>

    <ElForm ref="form" :model="formState">
      <template v-for="(eng, idx) in formState.engList" :key="idx">
        <ElFormItem
          :prop="`engList.${idx}`"
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
            <ElInput v-model="eng.key" />
            <ElInput v-model="eng.value" />
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
