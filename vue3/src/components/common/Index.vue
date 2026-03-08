<template>
  <slot />
  <div>{{ title }}</div>
</template>
<script setup lang="ts">
import { onUpdated } from 'vue'

const { title } = defineProps(['title'])
onUpdated(() => {
  console.log('=====updated=====')
})
</script>
