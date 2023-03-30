<script setup lang="ts">
import User from '@/components/svg/user.vue'
import Assistant from '@/components/svg/assistant.vue'
import Letter from '@/components/svg/letter.vue'
import Trash from '@/components/svg/trash.vue'
import type { ChatData } from '@/types/openai'

const conversation = ref<Array<ChatData>>([]) // 대화를 담을 배열

const contentList = ref<HTMLUListElement | null>(null) // ul element
const loading = ref<boolean>(false) // 로딩 상태

const prompt = ref('') // 서버에 넘겨줄 질문
const height = computed(() => {
  // 프롬프트에 개행이 포함된경우 textarea 높이값을 자동으로 보정하자
  if (prompt.value) {
    const row = prompt.value.match(/\n/g)
    if (row) {
      return `${3 + (row.length * 1.5)}rem`
    }
  }
  return '3rem'
})

async function quest () {
  // 질문시작
  const string = prompt.value // 질문값 string 저장
  conversation.value.push({role: 'user', content: string}) // 대화 리스트에 push
  loading.value = true // 로딩시작
  prompt.value = '' // textare를 초기화한다
  setTimeout(() => {
    if (contentList) {
      // 질문 후 스크롤을 최하단으로 이동시키기
      contentList.value?.scrollTo(0, contentList.value.scrollHeight)
    }
  }, 500) // 추가되는 시점을 보정하기위해 0.5초 지연
  
  const data = await $fetch('/api/browser', {
    method: 'POST',
    body: {
      prompt: string
    }
  }).catch((err) => {
    // 실패시
    console.log(err)
    if (err.data.statusMessage == 'proceeding') {
      // 진행중인경우 마지막 내용을 삭제함
      alert('이미 질문이 진행중입니다!')
      conversation.value.splice(-1)
      prompt.value = err.data.message
    }
  })
  
  loading.value = false // 로딩종료
  if (data?.result) {
    // 값이 전달됐다면 배열에 push
    conversation.value.push(data.result)
  }

  if (contentList) {
    // 답변 추가후 스크롤 최하단 이동
    contentList.value?.scrollTo(0, contentList.value.scrollHeight)
  }
}

function enterSubmit (e: KeyboardEvent) {
  // 엔터로 전송하기
  if (!e.shiftKey) {
    // 시프트키 없이 입력된경우만
    e.preventDefault()
    if (prompt.value) {
      // 질문이 있는경우에만 전송
      quest()
    }
  }
}

async function clearCookie () {
  if (confirm('대화를 초기화하시겠습니까?')) {
    // 대화삭제한다
    await $fetch('/api/remove')
    conversation.value = []
  }
}

onMounted(async () => {
  // 마운트시 리스트가 있다면 가져오기
  const result = await $fetch('/api/list')
  if (result) {
    conversation.value = result.data
  }
})

</script>
<template>
  <div class="grid w-full h-full align-top">
    <ul
      ref="contentList"
      class="w-full max-h-screen overflow-auto"
    >
      <li
        v-for="(list, index) in conversation"
        :key="index"
        class="px-5 py-8"
        :class="{
          'bg-gray-100': list.role == 'assistant',
          'border-t': list.role == 'assistant',
          'border-b': list.role == 'assistant',
        }"
      >
        <div class="flex gap-5 max-w-screen-lg mx-auto align-baseline">
          <div class="w-8">
            <User
              v-show="list.role == 'user'"
              class="w-8 h-8 fill-blue-500"
            />
            <Assistant
              v-show="list.role == 'assistant'"
              class="w-8 h-8 bg-green-500"
            />
          </div>
          <p class="flex-auto pt-0 whitespace-pre-wrap">
            {{ list.content }}
          </p>
        </div>
      </li>
      <li
        v-show="loading"
        class="px-5 py-8 bg-gray-100 border-t border-b"
      >
        <div class="flex gap-5 max-w-screen-lg mx-auto align-baseline">
          <div class="w-8">
            <Assistant class="w-8 h-8 bg-green-500" />
          </div>
          <i class="mt-3 loader">loading</i>
        </div>
      </li>
    </ul>
    <div class="flex w-full mt-auto justify-center">
      <div class="w-full max-w-screen-lg mb-3 resize-none relative">
        <textarea
          v-model="prompt"
          class="w-full p-3 resize-none border border-gray-200 rounded shadow focus:shadow-xl outline-none overflow-hidden"
          :style="{height: height}"
          placeholder="무엇이든 질문하세요!"
          @keydown.enter="enterSubmit($event)"
        >
        </textarea>
        <button
          class="px-3 py-2 hover:bg-gray-100 rounded absolute top-1/2 transform -translate-y-1/2 right-12"
          type="button"
          @click="quest"
        >
          <Letter class="w-4 h-4 fill-gray-500" />
        </button>
        <button
          class="px-3 py-2 hover:bg-red-100 rounded absolute top-1/2 transform -translate-y-1/2 right-3"
          type="button"
          @click="clearCookie()"
        >
          <Trash class="w-4 h-4 fill-red-500" />
        </button>
      </div>
    </div>
  </div>
</template>