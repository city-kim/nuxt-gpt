import { chat } from '@/server/lib/openai_completion'

export default defineEventHandler(async (event) => {
  console.log('event 수신')
  const body = await readBody(event)
  const quest = body.event.text as string // 질문
    
  if (!body.event.bot_profile) {
    // 봇 메시지가 아닌경우만 답변함
    chat([{role: 'user', content: quest}], body.event.channel)
  }
  return {
    challenge: body.challenge // hook 검증용으로 반환해야된다
  }
})