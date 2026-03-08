<script setup lang="ts">
import { onMounted, onUnmounted, onUpdated, reactive, ref, watch } from 'vue'
import Child from '@/components/modal/Index.vue'
import Common from '@/components/common/Index.vue'
import { el } from 'element-plus/es/locale'
const myText = ref<string>('case')
const counts = ref<number>(1)
const obj = reactive({ count: 0 })
const el = ref()
const maxNum: any = ref({
  cost: 100,
})
console.log(counts.value, '====count====')
function watchFn() {
  maxNum.value.cost++
  obj.count++
}
watch(counts, () => {
  console.log(counts.value, '====cs==')
})
watch(
  () => maxNum.value.cost,
  (newValue, oldValue) => {
    console.log(newValue, oldValue, '===change====')
  },
  {
    // deep: true,
    immediate: true,
  },
)

watch(obj, (newValue, oldValue) => {
  // 在嵌套的属性变更时触发
  // 注意：`newValue` 此处和 `oldValue` 是相等的
  // 因为它们是同一个对象！
  console.log(newValue, oldValue, '====reactivewatch====')
})
onUpdated(() => {
  console.log(obj.count, '=====updated======')
})
onMounted(() => {
  console.log(el.value, '==================mounted=============')
})
onUnmounted(() => {
  console.log('==========================unmounted============')
})
</script>
<template>
  <div ref="el">测试<Child v-model:count="counts" v-model:first-name.capitalize="myText" /></div>
  <button @click="watchFn">点击watch</button>
  <Common title="测试2222222">今天天气还可以把</Common>
</template>
