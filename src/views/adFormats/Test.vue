<template>
  <div>
    <ElButton @click="() => editForm.open()">Click</ElButton>
    isShow: {{ isShow }}
  </div>
</template>

<script setup lang="ts">
import { useEditForm } from './hooks'
const editForm = useEditForm()
const { isShow } = editForm
</script>

<!-- <script lang="ts">
import { defineComponent } from 'vue'
import { useEditForm } from './hooks'

export default defineComponent({
  setup() {
    const editForm = useEditForm()
    const isShow = editForm.isShow
    return { editForm, isShow }
  }
})
</script> -->
