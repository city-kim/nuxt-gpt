import { chat } from '@/server/lib/openai_completion'
import type { ChatType } from '@/types/openai'

export default defineEventHandler(async (event) => {
  console.log('slash 이벤트 수신')
  const body = await readBody(event)
  let channel = ''
  if (body.channel_name == 'directmessage') {
    // DM은 userid
    channel = body.user_id
  } else {
    // 채널은 채널id
    channel = body.channel_id
  }
  const target = {
    type: 'slack',
    id: channel
  } as ChatType

  if (body.command == '/clear') {
    // 초기화가 추가된경우
    target.remove = true
  }
  chat({role: 'user', content: body.text}, target)
  return '질문을 받았습니다!'
})