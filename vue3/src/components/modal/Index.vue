<script setup lang="ts">
const mode: any = defineModel('count')
const props = defineProps({
  count: Number,
  firstName: String,
})
// 首字母大写
const [modelt, firstModifiers] = defineModel('firstName', {
  set(value: any) {
    if (firstModifiers.capitalize) {
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
    return value
  },
})
function update() {
  mode.value++
}
</script>
<template>
  <div>{{ mode }} 测试2222</div>
  <button @click="update">点击</button>
  <input type="text" v-model="modelt" placeholder="dd" />
</template>
