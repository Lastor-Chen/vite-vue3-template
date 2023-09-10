import { ref, reactive } from 'vue'
import type { AdFormat } from '@/fetcher/adFormats'

// const state = reactive({
//   isShow: false,
//   rowData: undefined as AdFormat | undefined,
// })
const isShow = ref(false)
const rowData = ref<AdFormat>()

export function useEditForm() {
  function open(row: AdFormat) {
    // rowData.value = row
    isShow.value = true
  }

  function close() {
    isShow.value = false
  }

  return {
    isShow,
    rowData,
    open,
    close,
  }
}

