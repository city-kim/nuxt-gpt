<script setup lang="ts">
  const test = '123'

  const count = ref(0)

  function plus () {
    count.value ++
  }

  onMounted(async () => {
    const result = await $fetch('/api/gpt')
    console.log(result)
  })
</script>
<template>
  <div class="text-center">
    <h2>{{ test }}</h2>
    <button
      type="button"
      @click="plus"
    >
      더하기
    </button>
    <div
      class="py-5"
    >
      {{ count }}
    </div>
    <p>인덱스올시다</p>
  </div>
</template>