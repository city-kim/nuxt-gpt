import { chat } from '@/server/lib/openai_completion'
import type { ChatList } from '@/types/openai'

const conversation: Array<ChatList> = [] // 나눈 대화를 저장해서 기억하도록 함

export default defineEventHandler(async (event) => {
  // GPT에게 물어보기
  const body = await readBody(event)
  if (body.prompt) {
    // result값이 들어갔을때 배열에 저장
    console.log('질문내용 : ' + body.prompt)
    conversation.push({role: 'user', content: body.prompt})

    // 질문던지기
    const quest = await chat(conversation)
    if (quest) {
      // 답변이 정상적으로 왔다면 리턴
      conversation.push(quest)
      return {
        result: quest,
      }
    }
  } else {
    // 질문이 없는경우
    throw createError({
      statusCode: 400,
      statusMessage: '질문이 입력되지 않았습니다.',
    })
  }
})
